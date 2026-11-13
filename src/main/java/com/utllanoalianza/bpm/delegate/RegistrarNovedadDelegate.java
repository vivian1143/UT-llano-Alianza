package com.utllanoalianza.bpm.delegate;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/** Proceso 2 - "Registrar novedad en APP o planilla": acumula las novedades del mes. */
@Component("registrarNovedadDelegate")
public class RegistrarNovedadDelegate implements JavaDelegate {

    private static final Logger LOG = LoggerFactory.getLogger(RegistrarNovedadDelegate.class);

    @Override
    public void execute(DelegateExecution execution) {
        Number total = (Number) execution.getVariable("totalNovedades");
        Number horas = (Number) execution.getVariable("totalHorasNovedad");
        Number horasNovedad = (Number) execution.getVariable("horasNovedad");
        String detalle = (String) execution.getVariable("detalleNovedades");

        String linea = execution.getVariable("fechaVerificacion") + " - "
                + execution.getVariable("trabajadorNovedad") + " - "
                + execution.getVariable("tipoNovedad") + " - "
                + (horasNovedad == null ? 0 : horasNovedad) + " h";

        execution.setVariable("totalNovedades", (total == null ? 0 : total.longValue()) + 1);
        execution.setVariable("totalHorasNovedad",
                (horas == null ? 0 : horas.doubleValue()) + (horasNovedad == null ? 0 : horasNovedad.doubleValue()));
        execution.setVariable("detalleNovedades", (detalle == null || detalle.isBlank() ? "" : detalle + "\n") + linea);
        LOG.info("[APP] Novedad registrada: {}", linea);
    }
}
