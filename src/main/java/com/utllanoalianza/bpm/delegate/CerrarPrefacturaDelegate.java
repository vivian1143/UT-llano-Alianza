package com.utllanoalianza.bpm.delegate;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/** Proceso 2 - "Cerrar prefactura mensual de novedades": arma el resumen para nómina y facturación. */
@Component("cerrarPrefacturaDelegate")
public class CerrarPrefacturaDelegate implements JavaDelegate {

    private static final Logger LOG = LoggerFactory.getLogger(CerrarPrefacturaDelegate.class);

    @Override
    public void execute(DelegateExecution execution) {
        Number total = (Number) execution.getVariable("totalNovedades");
        Number horas = (Number) execution.getVariable("totalHorasNovedad");
        String detalle = (String) execution.getVariable("detalleNovedades");

        String resumen = "Prefactura " + execution.getVariable("mesProgramacion")
                + " | Proyecto: " + execution.getVariable("proyecto")
                + " | Sede: " + execution.getVariable("sede")
                + "\nTotal novedades: " + (total == null ? 0 : total)
                + " | Horas afectadas: " + (horas == null ? 0 : horas)
                + "\n" + (detalle == null || detalle.isBlank() ? "Sin novedades en el mes" : detalle);

        execution.setVariable("resumenPrefactura", resumen);
        execution.setVariable("prefacturaCerrada", true);
        LOG.info("[Prefactura] {}", resumen.replace('\n', ' '));
    }
}
