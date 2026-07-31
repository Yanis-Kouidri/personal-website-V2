---
locale: "fr"
title: "k3s-personal-servers"
date: "2026"
imagePath: "/src/assets/projects/k3s-personal-server.png"
githubUrl: "https://github.com/Yanis-Kouidri/k3s-personal-servers"
technologies: ["K3s", "Kubernetes", "FluxCD", "Helm", "SOPS", "Linux"]
---

Une plateforme de homelab personnelle construite autour de **k3s** sur un VPS, avec un déploiement piloté par GitOps via FluxCD.

Ce dépôt documente l'ensemble de l'installation du cluster et des services qu'il héberge, notamment :

- **FluxCD** pour la gestion du cluster en GitOps
- **SOPS** et **age** pour chiffrer les secrets Kubernetes
- Des scripts de sauvegarde automatisés pour les volumes persistants et les données applicatives
- Des applications telles que : Minecraft, n8n, Immich, ce site, Wireguard, Crowdsec et SonarQube
