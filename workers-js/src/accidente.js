// Workers del proceso 1: Investigar y Reportar Accidente de Trabajo.
const { Variables } = require("camunda-external-task-client-js");
const { correlacionarMensaje } = require("./camunda");

// Segundos que tarda la "ARL" simulada en responder. 0 = no responde (se prueba el temporizador).
const RESPUESTA_ARL_SEG = Number(process.env.SIMULAR_RESPUESTA_ARL_SEG ?? 20);

module.exports = (client) => {
  client.subscribe("notificarSst", async ({ task, taskService }) => {
    const v = task.variables;
    console.log(`[notificarSst] Correo al área SST: evento de ${v.get("nombreTrabajador")} en la sede ${v.get("sede")}`);
    await taskService.complete(task, new Variables().set("fechaNotificacionSst", new Date().toISOString()));
  });

  client.subscribe("reportarMintrabajo", async ({ task, taskService }) => {
    const radicado = `MT-${Date.now()}`;
    console.log(`[reportarMintrabajo] Accidente ${task.variables.get("gravedad")} reportado a la Dirección Territorial. Radicado ${radicado}`);
    await taskService.complete(task, new Variables().set("radicadoMinTrabajo", radicado));
  });

  client.subscribe("reportarArlEps", async ({ task, taskService }) => {
    const radicado = `ARL-${Date.now()}`;
    console.log(`[reportarArlEps] FURAT ${task.variables.get("numeroFurat")} enviado a ARL y EPS. Radicado ${radicado}`);
    const vars = new Variables();
    vars.set("radicadoArl", radicado);
    vars.set("fechaReporteArl", new Date().toISOString());
    await taskService.complete(task, vars);
  });

  // Antes era un JavaDelegate. Registra la actualización de la matriz de riesgos.
  client.subscribe("actualizarMatrizRiesgos", async ({ task, taskService }) => {
    const v = task.variables;
    const registro = `Sede ${v.get("sede")}: peligro actualizado por causas -> ${v.get("causasInmediatas")}. Se programa inspección de seguimiento.`;
    console.log(`[actualizarMatrizRiesgos] ${registro}`);
    const vars = new Variables();
    vars.set("matrizActualizada", true);
    vars.set("fechaActualizacionMatriz", new Date().toISOString().slice(0, 10));
    vars.set("registroMatriz", registro);
    await taskService.complete(task, vars);
  });

  client.subscribe("remitirInvestigacionArl", async ({ task, taskService }) => {
    console.log(`[remitirInvestigacionArl] Informe remitido a la ARL (radicado ${task.variables.get("radicadoArl")})`);
    await taskService.complete(task, new Variables().set("investigacionRemitida", true));

    // Simulación de la ARL: después de unos segundos envía el mensaje "conceptoArl"
    // que espera la compuerta basada en eventos.
    if (RESPUESTA_ARL_SEG > 0) {
      setTimeout(async () => {
        const ok = await correlacionarMensaje("conceptoArl", task.processInstanceId, {
          conceptoArl: "La ARL califica el evento como accidente de trabajo y avala la investigación.",
          recomendacionesArl: "Reforzar capacitación en uso de EPP y señalización de áreas húmedas."
        });
        console.log(`[ARL simulada] Mensaje conceptoArl ${ok ? "entregado" : "NO entregado"} a ${task.processInstanceId}`);
      }, RESPUESTA_ARL_SEG * 1000);
    }
  });
};
