// Workers del proceso 3: Elaborar Propuesta.
const { Variables } = require("camunda-external-task-client-js");

module.exports = (client) => {
  // Simula la consulta en SECOP II. Si al iniciar se marcó "Simular adenda", devuelve una.
  client.subscribe("consultarAdendasSecop", async ({ task, taskService }) => {
    const proceso = task.variables.get("numeroProceso");
    const hayAdendas = task.variables.get("simularAdenda") === true;
    const vars = new Variables();
    vars.set("hayAdendas", hayAdendas);
    vars.set("detalleAdenda", hayAdendas
      ? `Adenda No. 1 al proceso ${proceso}: se modifica la experiencia mínima exigida.`
      : "Sin adendas publicadas");
    console.log(`[consultarAdendasSecop] Proceso ${proceso}: hayAdendas=${hayAdendas}`);
    await taskService.complete(task, vars);
  });

  // Evento final de mensaje "Propuesta enviada a radicación"
  client.subscribe("notificarRadicacion", async ({ task, taskService }) => {
    console.log(`[notificarRadicacion] Propuesta del proceso ${task.variables.get("numeroProceso")} enviada al proceso Radicar Propuesta`);
    await taskService.complete(task, new Variables().set("fechaEnvioRadicacion", new Date().toISOString()));
  });
};
