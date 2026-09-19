const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const store = getStore("redesociale");

  try {
    if (event.httpMethod === "GET") {
      const data = await store.get("db", { type: "json" });
      return { statusCode: 200, headers, body: JSON.stringify(data || {}) };
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      await store.setJSON("db", body);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: "Método não permitido" }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
