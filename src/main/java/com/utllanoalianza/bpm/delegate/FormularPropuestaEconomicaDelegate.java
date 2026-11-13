package com.utllanoalianza.bpm.delegate;

import java.text.NumberFormat;
import java.util.Locale;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Proceso 3 - "Formular propuesta económica".
 * valor = operarios x salario x (1 + factor prestacional) x meses x (1 + AIU/100)
 */
@Component("formularPropuestaEconomicaDelegate")
public class FormularPropuestaEconomicaDelegate implements JavaDelegate {

    private static final Logger LOG = LoggerFactory.getLogger(FormularPropuestaEconomicaDelegate.class);

    @Override
    public void execute(DelegateExecution execution) {
        double operarios = num(execution, "numeroOperarios");
        double salario = num(execution, "salarioBase");
        double factor = num(execution, "factorPrestacional");
        double meses = num(execution, "mesesContrato");
        double aiu = num(execution, "porcentajeAiu");

        double costoPersonal = operarios * salario * (1 + factor) * meses;
        double valorPropuesta = costoPersonal * (1 + aiu / 100.0);

        NumberFormat cop = NumberFormat.getCurrencyInstance(Locale.forLanguageTag("es-CO"));
        String resumen = "Costo de personal: " + cop.format(costoPersonal)
                + " | AIU " + aiu + "%: " + cop.format(valorPropuesta - costoPersonal)
                + " | Valor total de la propuesta: " + cop.format(valorPropuesta);

        execution.setVariable("costoPersonal", costoPersonal);
        execution.setVariable("valorPropuesta", valorPropuesta);
        execution.setVariable("resumenEconomico", resumen);
        LOG.info("[Propuesta económica] {}", resumen);
    }

    private static double num(DelegateExecution execution, String nombre) {
        Object valor = execution.getVariable(nombre);
        if (!(valor instanceof Number n)) {
            throw new IllegalArgumentException("Falta la variable numérica " + nombre);
        }
        return n.doubleValue();
    }
}
