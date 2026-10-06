# Agent Business Lab

[English](README.en.md) · [Español](README.es.md)

Un laboratoire MCP local pour mesurer le résultat métier d'un agent, avec des données entièrement synthétiques. Quatre scénarios vérifient une relance de devis sans doublon, un rappel de facture non envoyé, la séparation entre dossiers clients et une rupture de stock. Le score vient de l'état final et des tentatives enregistrées, pas du texte de l'agent.

## Essayer

    node src/cli.js scenarios
    node src/cli.js init quote-followup demo.state.json
    node src/cli.js serve demo.state.json
    node src/cli.js score demo.state.json
    npm test

La commande serve est un serveur MCP sur stdio. Configurez votre client MCP pour lancer node avec src/cli.js serve et le chemin absolu du fichier d'état. Donnez à l'agent la consigne affichée par scenarios dans la langue voulue. Les outils et descriptions sont disponibles en français, anglais et espagnol. Initialisez un fichier neuf pour chaque essai.

Le score retourne le code 0 pour une réussite et 2 pour un échec. Les données sont fictives ; ce dépôt ne se connecte ni à incwo ni à Bruno. Pour comparer plusieurs agents, utilisez le même scénario et des états réinitialisés. Les scénarios ne prétendent pas certifier une plateforme ni couvrir toutes les règles commerciales.

OpenClaw et Hermes peuvent lancer un serveur MCP stdio. Les agents cloud nécessitent un transport compatible ou un adaptateur hébergé : aucun accès direct à Muse, aux dots ou à OCE n'est inclus dans cette première version.

Licence MIT.
