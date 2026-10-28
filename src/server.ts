import Fastify from "fastify";
import { initDB, pool } from "./db/index.js";
import type { Document } from "./types/documents.ts";
import type { Changelog } from "./types/changelog.ts";
const app = Fastify({
  logger: false,
});

app.get("/health", async (request, reply) => {
  try {
    const dbRes = await pool.query("SELECT NOW()");
    return reply.send({
      status: "healthy",
      database: "connected",
      timestamp: dbRes.rows[0].now,
    });
  } catch (error: any) {
    app.log.error(error);
    return reply.status(500).send({
      status: "unhealthy",
      database: "error",
      message: error.message || "Database Not Connected",
    });
  }
});

// GET - /documents?since=timestamp - FETCH/SYNC documents
app.get<{ Querystring: { since: string } }>(
  "/documents",
  async (request, reply) => {
    try {
      const { since } = request.query;

      const dbRes =
        since != null
          ? await pool.query("SELECT * FROM documents WHERE updated_at>=$1", [
              since,
            ])
          : await pool.query("SELECT * FROM documents");

      return reply.status(200).send({
        documents: dbRes.rows,
        count: dbRes.rowCount,
      });
    } catch (error: any) {
      app.log.error(error);
      return reply.status(500).send({
        error: error.message,
      });
    }
  },
);

// POST - /document - Create New Document
app.post<{ Body: { title: string; content: string } }>(
  "/document",
  async (request, reply) => {
    try {
      const { title, content } = request.body;
      const dbRes = await pool.query(
        "INSERT INTO documents (title, content) VALUES ($1, $2) RETURNING *",
        [title, content],
      );
      return reply.status(200).send({
        document: dbRes.rows[0],
      });
    } catch (error: any) {
      app.log.error(error);
      return reply.status(500).send({
        error: error.message,
      });
    }
  },
);

// POST - /document/:document_id/sync - Update/Sync Document from client to server
app.post<{
  Params: { document_id: string };
  Body: {
    client_id: number;
    title: string;
    content: string;
    version: number;
    description: string;
  };
}>("/document/:document_id/sync", async (request, reply) => {
  try {
    const { document_id } = request.params;
    const { client_id, title, content, version, description } = request.body;

    const result = await pool.query("SELECT * FROM documents WHERE id=$1", [
      document_id,
    ]);

    const latestDoc: Document = result.rows[0];

    if (latestDoc.version > version) {
      return reply.status(409).send({
        status: "outdated",
        latest_document: latestDoc,
      });
    }
    const nextVersion = version + 1;

    const updateDoc = await pool.query(
      "UPDATE documents SET title=$1, content=$2, version=$3 WHERE id=$4 RETURNING *",
      [title, content, nextVersion, document_id],
    );

    const updatedDoc: Document = updateDoc.rows[0];

    const createChangelog = await pool.query(
      "INSERT INTO changelogs (client_id,document_id,type,client_version,server_version,resolution,description) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [client_id, document_id, version, latestDoc.version, null, description],
    );

    const createdChangelog: Changelog = createChangelog.rows[0];

    return reply.status(200).send({
      document: updatedDoc,
      changelog: createdChangelog,
      status: "updated",
    });
  } catch (error: any) {
    app.log.error(error);
    return reply.status(500).send({
      error: error.message,
    });
  }
});

const start = async () => {
  try {
    if (!(await initDB())) {
      console.log("Database not connected");
    }
    const PORT: number = Number(process.env.PORT) || 3000;
    await app.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`Synapse server listening on http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
