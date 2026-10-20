import Fastify from "fastify";
import { initDB, pool } from "./db/index.js";

const app = Fastify({
  logger: true,
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
      message: error.message,
    });
  }
});

const start = async () => {
  try {
    await initDB();
    const PORT: number = Number(process.env.PORT) || 3000;
    await app.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`Synapse server listening on http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
