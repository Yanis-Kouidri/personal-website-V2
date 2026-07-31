---
locale: "en"
title: "k3s-personal-servers"
date: "2026"
imagePath: "/src/assets/projects/k3s-personal-server.png"
githubUrl: "https://github.com/Yanis-Kouidri/k3s-personal-servers"
technologies: ["K3s", "Kubernetes", "FluxCD", "Helm", "SOPS", "Linux"]
---

A personal homelab platform built around **k3s** on a VPS, with GitOps-driven deployments via FluxCD.

This repository documents the full setup of the cluster and the services running on it, including:

- **FluxCD** for GitOps-based cluster management
- **SOPS** and **age** for encrypted Kubernetes secrets
- Automated backup scripts for persistent volumes and application data
- Applications such as Minecraft, n8n, Immich, this site, WireGuard, CrowdSec, and SonarQube
