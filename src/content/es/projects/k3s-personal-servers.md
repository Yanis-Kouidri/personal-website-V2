---
locale: "es"
title: "k3s-personal-servers"
date: "2026"
imagePath: "/src/assets/projects/k3s-personal-server.png"
githubUrl: "https://github.com/Yanis-Kouidri/k3s-personal-servers"
technologies: ["K3s", "Kubernetes", "FluxCD", "Helm", "SOPS", "Linux"]
---

Una plataforma de homelab personal construida sobre **k3s** en una VPS, con despliegues guiados por GitOps a través de FluxCD.

Este repositorio documenta toda la configuración del clúster y de los servicios que ejecuta, incluyendo:

- **FluxCD** para la gestión del clúster con GitOps
- **SOPS** y **age** para secretos de Kubernetes cifrados
- Scripts de backup automatizados para volúmenes persistentes y datos de aplicaciones
- Aplicaciones como Minecraft, n8n, Immich, este sitio, WireGuard, CrowdSec y SonarQube
