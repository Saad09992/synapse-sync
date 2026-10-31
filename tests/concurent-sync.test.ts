interface Document {
  id: number;
  title: string;
  content: string;
  version: number;
  created_at: EpochTimeStamp;
  updated_at: EpochTimeStamp;
}

const createDocument = async () => {
  const resp = await fetch("http://localhost:3000/document", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      title: "doc title",
      content: "doc content",
    }),
  });
  const data = await resp.json();

  return data.document as Document;
};

const test = async (doc_id: number, doc_version: number) => {
  let promises = [];
  for (let i = 0; i < 10; i++) {
    const resp = fetch(`http://localhost:3000/document/${doc_id}/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: 1,
        title: `REQ ${i}`,
        content: `REQ ${i}`,
        version: doc_version,
        description: "this is a update for req 1",
      }),
    });
    promises.push(resp);
  }
  const resp = await Promise.all(promises);
  resp.forEach((element) => {
    console.log(element.status);
  });
};
const document: Document = await createDocument();
console.log(`Document Created: ${document.id}`);
await test(document.id, document.version);
