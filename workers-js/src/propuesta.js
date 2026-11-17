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

  // Antes era un JavaDelegate (subproceso económico).
  // valor = operarios x salario x (1 + factor prestacional) x meses x (1 + AIU/100)
  client.subscribe("formularPropuestaEconomica", async ({ task, taskService }) => {
    const v = task.variables;
    const nombres = ["numeroOperarios", "salarioBase", "factorPrestacional", "mesesContrato", "porcentajeAiu"];
    const faltan = nombres.filter((n) => typeof v.get(n) !== "number");
    if (faltan.length) {
      console.log(`[formularPropuestaEconomica] Faltan datos: ${faltan.join(", ")}`);
      await taskService.handleFailure(task, { errorMessage: "Faltan datos: " + faltan.join(", "), retries: 0, retryTimeout: 0 });
      return;
    }
    const [operarios, salario, factor, meses, aiu] = nombres.map((n) => v.get(n));
    const costoPersonal = operarios * salario * (1 + factor) * meses;
    const valorPropuesta = costoPersonal * (1 + aiu / 100);
    const cop = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" });
    const resumen = `Costo de personal: ${cop.format(costoPersonal)} | AIU ${aiu}%: ${cop.format(valorPropuesta - costoPersonal)} | Valor total de la propuesta: ${cop.format(valorPropuesta)}`;
    const vars = new Variables();
    vars.setTyped("costoPersonal", { value: costoPersonal, type: "Double" });
    vars.setTyped("valorPropuesta", { value: valorPropuesta, type: "Double" });
    vars.set("resumenEconomico", resumen);
    console.log(`[formularPropuestaEconomica] ${resumen}`);
    await taskService.complete(task, vars);
  });

  // Evento final de mensaje "Propuesta enviada a radicación"
  client.subscribe("notificarRadicacion", async ({ task, taskService }) => {
    console.log(`[notificarRadicacion] Propuesta del proceso ${task.variables.get("numeroProceso")} enviada al proceso Radicar Propuesta`);
    await taskService.complete(task, new Variables().set("fechaEnvioRadicacion", new Date().toISOString()));
  });
};
