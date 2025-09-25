export default async function predictTumorFromBase64(base64: string) {
  try {
    const res = await fetch("https://tumect-api.onrender.com/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ b64: base64 }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Prediction error:", err);
    throw err;
  }
}
