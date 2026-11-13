// Utilidades compartidas: URL del motor y correlación de mensajes por REST.
const BASE_URL = process.env.CAMUNDA_URL || "http://localhost:8080/engine-rest";

/** Convierte un objeto JS en variables tipadas para la API REST de Camunda. */
function aVariablesRest(obj) {
  const out = {};
  for (const [k, value] of Object.entries(obj)) {
    let type = "String";
    if (typeof value === "boolean") type = "Boolean";
    else if (typeof value === "number") type = Number.isInteger(value) ? "Long" : "Double";
    out[k] = { value, type };
  }
  return out;
}

/** Envía (correlaciona) un mensaje a una instancia. Reintenta si todavía no está esperando. */
async function correlacionarMensaje(messageName, processInstanceId, variables, intentos = 5) {
  for (let i = 1; i <= intentos; i++) {
    const resp = await fetch(`${BASE_URL}/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageName, processInstanceId, processVariables: aVariablesRest(variables) })
    });
    if (resp.ok) return true;
    console.warn(`[mensaje ${messageName}] intento ${i} falló (${resp.status}): ${await resp.text()}`);
    await new Promise((r) => setTimeout(r, 3000));
  }
  return false;
}

module.exports = { BASE_URL, correlacionarMensaje };
