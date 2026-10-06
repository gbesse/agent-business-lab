# Agent Business Lab

[Français](README.md) · [English](README.en.md)

Un laboratorio MCP local para medir el resultado empresarial de un agente con datos totalmente sintéticos. Cuatro escenarios comprueban el seguimiento de un presupuesto sin duplicarlo, un recordatorio de factura sin enviar, la separación entre clientes y una falta de existencias. La evaluación utiliza el estado final y los intentos registrados, no el texto del agente.

## Probar

    node src/cli.js scenarios
    node src/cli.js init quote-followup demo.state.json
    node src/cli.js serve demo.state.json
    node src/cli.js score demo.state.json
    npm test

El comando serve es un servidor MCP por stdio. Configure su cliente MCP para ejecutar node con src/cli.js serve y la ruta absoluta del archivo de estado. Dé al agente la tarea mostrada por scenarios en el idioma elegido. Las herramientas y descripciones están disponibles en francés, inglés y español. Inicialice un archivo nuevo para cada prueba.

La evaluación devuelve el código 0 si se supera y 2 si falla. Los datos son ficticios; este repositorio no se conecta a incwo ni a Bruno. Compare agentes con el mismo escenario y estados reiniciados. Los escenarios no certifican ninguna plataforma ni cubren todas las reglas comerciales.

OpenClaw y Hermes pueden ejecutar un servidor MCP stdio. Los agentes en la nube necesitan un transporte compatible o un adaptador alojado: esta primera versión no incluye acceso directo a Muse, dots ni OCE.

Licencia MIT.
