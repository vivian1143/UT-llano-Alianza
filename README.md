# UT-llano-Alianza
Proyecto de Curso de Profundización Software 1

## Integrantes
- Laura Vanessa Hernandez Garcia 160004630
- Vivian Andrea Prado Zuleta 160004632
- Daniel Felipe Espinosa Alvarez 160004707

# Cada integrante hizo un proceso

Todos los archivos están en src/main/resources/ (carpetas bpmn/, dmn/ y forms/) y se despliegan solos al correr el proyecto:

## Proceso 1: Investigar y Reportar Accidente de Trabajo
**Responsable:** Laura Vanessa Hernandez Garcia
**Nombre para dar Start:** Investigar y Reportar Accidente de Trabajo

**BPMN** (src/main/resources/bpmn/)
- accidenteTrabajo.bpmn (proceso principal)
- investigarAccidente.bpmn (Call Activity: Investigar Accidente)

**DMN** (src/main/resources/dmn/)
- decisionReportesAccidente.dmn

**Forms** (src/main/resources/forms/)
- formInformarEvento.form
- formAtenderTrabajador.form
- formClasificarEvento.form
- formDiligenciarFurat.form
- formRegistrarIncapacidad.form
- formRevisarConceptoArl.form
- formConformarEquipo.form
- formDefinirAcciones.form
- formImplementarAcciones.form
- formVerificarAcciones.form
- formRecolectarEvidencias.form
- formIdentificarCausas.form
- formInformeInvestigacion.form

**Workers**(workers-js/src)
- accidente.js

## Proceso 2: Programar y Controlar Asistencia del Personal
**Responsable:** Daniel Felipe Espinosa Alvarez
**Nombre para dar Start:** Programar y Controlar Asistencia del Personal

**BPMN** (src/main/resources/bpmn/)
- asistenciaPersonal.bpmn (proceso principal)
- gestionarPersonalAdicional.bpmn (Call Activity: Gestionar Personal Adicional)

**DMN** (src/main/resources/dmn/)
- decisionEvaluarNovedad.dmn

**Forms** (src/main/resources/forms/)
- formPlanMensual.form
- formAsignarPersonal.form
- formVerificarAsistencia.form
- formCubrirAusencia.form
- formRecibirNovedadesNomina.form
- formAuditarNovedades.form
- formCorregirNovedades.form
- formRecibirSoportesFacturacion.form
- formRespuestaCliente.form
- formSolicitarReclutamiento.form
- formRevisarHojasVida.form
- formVincularPersonal.form

**Workers**(workers-js/src)
- asistencia.js

## Proceso 3: Elaborar Propuesta
**Responsable:** Vivian Andrea Prado Zuleta
**Nombre para dar Start:** Elaborar Propuesta

**BPMN** (src/main/resources/bpmn/)
- elaborarPropuesta.bpmn (proceso principal)
- elaborarPropuestaEconomica.bpmn (Call Activity: Elaborar Propuesta Económica)

**DMN** (src/main/resources/dmn/)
- decisionFactorDesempate.dmn

**Forms** (src/main/resources/forms/)
- formIniciarPropuesta.form
- formRevisarPliego.form
- formAsignarResponsables.form
- formDocumentosJuridicos.form
- formDocumentosTecnicos.form
- formVerificarConsistencia.form
- formFactoresDesempate.form
- formAjustarAdenda.form
- formCorregirPropuesta.form
- formAprobarPropuesta.form
- formEntregarPropuesta.form
- formCalcularCostos.form

**Workers** (workers-js/src/)
- propuesta.js

---

# Cambios para la entrega final
 
## Portal web
**Responsable:** Laura Vanessa Hernandez Garcia
 
El portal es una aplicación aparte (carpeta portal-web, puerto 8081) que se comunica con Camunda solo por su API REST.
Cada actor entra con su usuario, ve solo sus actividades pendientes y completa sus formularios.
El usuario demo es el administrador y es el único que puede cancelar procesos.
 
**Usuarios** (la contraseña es igual al usuario)
- Accidente: trabajador, supervisor, sst, investigador, nomina
- Asistencia: coordinador, supervisor, gestionHumana, nomina, facturacion
- Propuesta: legal, proyectos, financiera, gerencia
- Administrador: demo
## Corrección de la retroalimentación
**Responsable:** Vivian Andrea Prado Zuleta
 
En la entrega anterior algunas tareas usaban JavaDelegate y fallaban en Camunda Run.
Se cambiaron por External Tasks que hacen los workers en JavaScript, así los procesos funcionan en Camunda Run y en Spring Boot.
 
Cambios en los BPMN (src/main/resources/bpmn/)
- accidenteTrabajo.bpmn: la tarea Actualizar matriz de riesgos ahora es External Task
- asistenciaPersonal.bpmn: las tareas Registrar novedad y Cerrar prefactura ahora son External Task
- elaborarPropuestaEconomica.bpmn: la tarea Formular propuesta económica ahora es External Task
Cambios en los workers (workers-js/src)
- accidente.js: se agregó el worker actualizarMatrizRiesgos
- asistencia.js: se agregaron los workers registrarNovedad y cerrarPrefactura
- propuesta.js: se agregó el worker formularPropuestaEconomica

---

# Cómo ejecutar
1. En la raíz del proyecto (donde está el pom.xml): mvn spring-boot:run
2. En otra terminal colocar cd workers-js para ir a la carpeta, luego npm install(si no esta instalado) y npm start(para que empiece a escuchar el puerto) deben aparecer 13 mensajes "subscribed to topic"
3. Para el portal, en IntelliJ abrir portal-web/src/main/java/com/utllanoalianza/portal/PortalApplication.java, dar click derecho y Run 'PortalApplication'. Esperar a que diga que arrancó en el puerto 8081
4. Entrar al portal en http://localhost:8081 con el usuario de cada rol (la contraseña es igual al usuario)
5. ambién se puede entrar a http://localhost:8080 con usuario demo y contraseña demo, abrir Tasklist y dar Start process
6. En nuestro repositorio se encuentra el documento ut llano alianza.pdf el cual contiene el recorrido de los procesos con su visualizacion en el Tasklist de camunda

Los procesos Investigar Accidente, Gestionar Personal Adicional y Elaborar Propuesta Económica aparecen en la lista pero son subprocesos (Call Activity) entonces los llama el proceso principal y no se inician a mano

**Ejecución en Camunda Run:** se despliegan las carpetas bpmn, dmn y forms y se inician los workers (paso 2)
