---
locale: "ru"
title: "k3s-personal-servers"
date: "2026"
imagePath: "/src/assets/projects/k3s-personal-server.png"
githubUrl: "https://github.com/Yanis-Kouidri/k3s-personal-servers"
technologies: ["K3s", "Kubernetes", "FluxCD", "Helm", "SOPS", "Linux"]
---

Личный homelab-проект, построенный вокруг **k3s** на VPS, с GitOps-развёртыванием через FluxCD.

В этом репозитории задокументированы настройка кластера и сервисы, которые на нём работают, включая:

- **FluxCD** для управления кластером через GitOps
- **SOPS** и **age** для шифрования секретов Kubernetes
- Автоматизированные скрипты резервного копирования для persistent volume и данных приложений
- Приложения вроде Minecraft, n8n, Immich, этого сайта, WireGuard, CrowdSec и SonarQube
