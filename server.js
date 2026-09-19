const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

let db;

async function connectDB() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db("redesociale");
  console.log("Conectado ao MongoDB!");
}

// GET /api/db -> retorna o banco inteiro
app.get("/api/db", async (req, res) => {
  try {
    const doc = await db.collection("dados").findOne({ _id: "principal" });
    res.json(doc ? doc.conteudo : {});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/db -> salva o banco inteiro
app.post("/api/db", async (req, res) => {
  try {
    await db.collection("dados").updateOne(
      { _id: "principal" },
      { $set: { conteudo: req.body } },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/", (req, res) => res.send("REDESOCIALE API online"));

connectDB().then(() => {
  app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));
});
