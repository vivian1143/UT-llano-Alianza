# UT-llano-Alianza
Proyecto de Curso de Profundización Software 1

Este repo es el motor: Camunda 7.24 en Spring Boot con los BPMN, DMN y forms, corre en el puerto 8080.
La guía general del proyecto (cómo se conecta todo, cómo se instala, en qué orden se prende y las pruebas) está en el repo ut-llano-alianza-hub

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

**Workers**(ahora en un nuevo repo) 
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

**Workers**(ahora en un nuevo repo) 
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

**Workers**(ahora en un nuevo repo) 
- propuesta.js

---

# Cambios para la entrega final

## Corrección de la retroalimentación
**Responsable:** Vivian Andrea Prado Zuleta
 
En la entrega anterior algunas tareas usaban JavaDelegate y fallaban en Camunda Run.
Se cambiaron por External Tasks que hacen los workers en JavaScript, así los procesos funcionan en Camunda Run y en Spring Boot.
 
- Los workers y el portal pasaron a sus propios repos (ut-llano-alianza-workers y ut-llano-alianza-portal-interno), este repo queda solo con el motor
- formRevisarConceptoArl.form: ahora muestra qué ARL respondió y su calificación, que llegan desde el portal de la ARL
- formCalcularCostos.form: el ejemplo del salario ahora es el mínimo 2026 porque el servicio de registros no deja poner salarios menores

---

# Cómo ejecutar
1. En IntelliJ abrir src/main/java/com/utllanoalianza/bpm/Application.java, dar click derecho y Run 'Application'. También se puede con mvn spring-boot:run en la raíz del proyecto (donde está el pom.xml)
2. Entrar a http://localhost:8080 con usuario demo y contraseña demo
3. Lo demás (servicio de registros, workers, portal interno y portal de la ARL) se prende en el orden que dice el README del hub
4. En nuestro repositorio se encuentra el documento ut llano alianza.pdf el cual contiene el recorrido de los procesos con su visualizacion en el Tasklist de camunda

Al correr el proyecto se despliegan solos los BPMN, DMN y forms y se crean los usuarios de cada rol.
Los procesos Investigar Accidente, Gestionar Personal Adicional y Elaborar Propuesta Económica aparecen en la lista pero son subprocesos (Call Activity) entonces los llama el proceso principal y no se inician a mano

**Ejecución en Camunda Run:** se despliegan las carpetas bpmn, dmn y forms, se crean los usuarios con node scripts/crearUsuarios.js del repo hub y se prenden los workers
