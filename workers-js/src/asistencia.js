// Workers del proceso 2: Programar y Controlar Asistencia del Personal.
const { Variables } = require("camunda-external-task-client-js");

module.exports = (client) => {
  client.subscribe("comunicarTurnosCliente", async ({ task, taskService }) => {
    const v = task.variables;
    console.log(`[comunicarTurnosCliente] Programación de ${v.get("mesProgramacion")} enviada al cliente del proyecto ${v.get("proyecto")}`);
    await taskService.complete(task, new Variables().set("fechaEnvioCliente", new Date().toISOString()));
  });

  // Evento intermedio de lanzamiento de mensaje "Turnos comunicados al personal"
  client.subscribe("comunicarTurnosPersonal", async ({ task, taskService }) => {
    console.log(`[comunicarTurnosPersonal] Turnos enviados al personal de la sede ${task.variables.get("sede")}`);
    await taskService.complete(task, new Variables().set("turnosComunicados", true));
  });

  // Lo dispara el temporizador no interruptivo de "Verificar asistencia diaria en sede"
  client.subscribe("recordarVerificacionAsistencia", async ({ task, taskService }) => {
    console.log(`[recordarVerificacionAsistencia] Recordatorio al supervisor de la sede ${task.variables.get("sede")}: falta verificar la asistencia`);
    await taskService.complete(task, new Variables().set("ultimoRecordatorio", new Date().toISOString()));
  });
};
