package com.utllanoalianza.bpm.config;

import org.camunda.bpm.engine.IdentityService;
import org.camunda.bpm.engine.identity.Group;
import org.camunda.bpm.engine.identity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * Crea un grupo por cada carril (lane) de los BPMN y un usuario por grupo.
 * Usuario y contraseña son iguales (ej. sst / sst). El usuario demo queda en todos los grupos.
 */
@Component
public class UsuariosYGruposConfig {

    private static final Logger LOG = LoggerFactory.getLogger(UsuariosYGruposConfig.class);

    // {id del grupo, nombre del grupo}
    private static final String[][] GRUPOS = {
        {"trabajador", "Trabajador afectado o testigo"},
        {"supervisor", "Jefe inmediato / Supervisor de sede"},
        {"investigador", "Equipo investigador"},
        {"nomina", "Analista de nómina"},
        {"sst", "Coordinador SST"},
        {"coordinador", "Coordinador Operativo"},
        {"gestionHumana", "Gestión Humana"},
        {"facturacion", "Área de facturación"},
        {"legal", "Coordinador de Asuntos Legales y Contractuales"},
        {"proyectos", "Director de Proyectos"},
        {"financiera", "Área financiera"},
        {"gerencia", "Gerencia"}
    };

    private final IdentityService identityService;

    public UsuariosYGruposConfig(IdentityService identityService) {
        this.identityService = identityService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void crearUsuariosYGrupos() {
        for (String[] g : GRUPOS) {
            String id = g[0];
            if (identityService.createGroupQuery().groupId(id).count() == 0) {
                Group grupo = identityService.newGroup(id);
                grupo.setName(g[1]);
                grupo.setType("WORKFLOW");
                identityService.saveGroup(grupo);
            }
            if (identityService.createUserQuery().userId(id).count() == 0) {
                User usuario = identityService.newUser(id);
                usuario.setFirstName(g[1]);
                usuario.setLastName("UT Llano Alianza");
                usuario.setPassword(id);
                identityService.saveUser(usuario);
                identityService.createMembership(id, id);
            }
            if (identityService.createUserQuery().userId("demo").memberOfGroup(id).count() == 0) {
                identityService.createMembership("demo", id);
            }
        }
        LOG.info("Usuarios y grupos de UT Llano Alianza listos ({} grupos)", GRUPOS.length);
    }
}
