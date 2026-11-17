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

  // Antes era un JavaDelegate. Acumula las novedades del mes.
  client.subscribe("registrarNovedad", async ({ task, taskService }) => {
    const v = task.variables;
    const horas = Number(v.get("horasNovedad") || 0);
    const linea = `${v.get("fechaVerificacion")} - ${v.get("trabajadorNovedad")} - ${v.get("tipoNovedad")} - ${horas} h`;
    const detalle = v.get("detalleNovedades");
    const vars = new Variables();
    vars.setTyped("totalNovedades", { value: Number(v.get("totalNovedades") || 0) + 1, type: "Long" });
    vars.setTyped("totalHorasNovedad", { value: Number(v.get("totalHorasNovedad") || 0) + horas, type: "Double" });
    vars.set("detalleNovedades", (detalle ? detalle + "\n" : "") + linea);
    console.log(`[registrarNovedad] Novedad registrada: ${linea}`);
    await taskService.complete(task, vars);
  });

  // Antes era un JavaDelegate. Arma el resumen de novedades para nómina y facturación.
  client.subscribe("cerrarPrefactura", async ({ task, taskService }) => {
    const v = task.variables;
    const resumen = `Prefactura ${v.get("mesProgramacion")} | Proyecto: ${v.get("proyecto")} | Sede: ${v.get("sede")}\n`
      + `Total novedades: ${v.get("totalNovedades") || 0} | Horas afectadas: ${v.get("totalHorasNovedad") || 0}\n`
      + (v.get("detalleNovedades") || "Sin novedades en el mes");
    const vars = new Variables();
    vars.set("resumenPrefactura", resumen);
    vars.set("prefacturaCerrada", true);
    console.log(`[cerrarPrefactura] ${resumen.replace(/\n/g, " ")}`);
    await taskService.complete(task, vars);
  });

  // Lo dispara el temporizador no interruptivo de "Verificar asistencia diaria en sede"
  client.subscribe("recordarVerificacionAsistencia", async ({ task, taskService }) => {
    console.log(`[recordarVerificacionAsistencia] Recordatorio al supervisor de la sede ${task.variables.get("sede")}: falta verificar la asistencia`);
    await taskService.complete(task, new Variables().set("ultimoRecordatorio", new Date().toISOString()));
  });
};
