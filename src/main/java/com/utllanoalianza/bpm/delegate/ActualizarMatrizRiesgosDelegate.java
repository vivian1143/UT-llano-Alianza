package com.utllanoalianza.bpm.delegate;

import java.time.LocalDate;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/** Proceso 1 - "Actualizar matriz de riesgos e inspecciones" (service task con JavaDelegate). */
@Component("actualizarMatrizRiesgosDelegate")
public class ActualizarMatrizRiesgosDelegate implements JavaDelegate {

    private static final Logger LOG = LoggerFactory.getLogger(ActualizarMatrizRiesgosDelegate.class);

    @Override
    public void execute(DelegateExecution execution) {
        String sede = (String) execution.getVariable("sede");
        String causas = (String) execution.getVariable("causasInmediatas");
        String registro = "Sede " + sede + ": peligro actualizado por causas -> " + causas
                + ". Se programa inspección de seguimiento.";
        execution.setVariable("matrizActualizada", true);
        execution.setVariable("fechaActualizacionMatriz", LocalDate.now().toString());
        execution.setVariable("registroMatriz", registro);
        LOG.info("[Matriz de riesgos] {}", registro);
    }
}
