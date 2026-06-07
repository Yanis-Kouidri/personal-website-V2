import type { Icon as IconType } from "@lucide/astro";
import {
	Code2,
	Globe,
	Infinity as InfinityLogo,
	Network,
	Server,
	ShieldCheck,
} from "lucide-astro";

export interface SkillItem {
	name: string;
	logoPath: string;
	url: string;
}

export interface SkillCategory {
	id: string;
	label: string;
	icon: typeof IconType;
	skills: SkillItem[];
}

export const skillCategories: SkillCategory[] = [
	{
		id: "web",
		label: "Web",
		icon: Globe,
		skills: [
			{
				name: "JavaScript",
				logoPath: "/skills/web/javascript.svg",
				url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
			},
			{
				name: "TypeScript",
				logoPath: "/skills/web/typescript.svg",
				url: "https://www.typescriptlang.org/",
			},
			{
				name: "React",
				logoPath: "/skills/web/react.svg",
				url: "https://react.dev/",
			},
			{
				name: "Astro",
				logoPath: "/skills/web/astro.svg",
				url: "https://astro.build/",
			},
			{
				name: "Bun",
				logoPath: "/skills/web/bun.svg",
				url: "https://bun.sh/",
			},
			{
				name: "NodeJS",
				logoPath: "/skills/web/nodejs.svg",
				url: "https://nodejs.org/",
			},
			{
				name: "HTML5",
				logoPath: "/skills/web/html5.svg",
				url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
			},
			{
				name: "CSS3",
				logoPath: "/skills/web/css3.svg",
				url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
			},
			{
				name: "Vite",
				logoPath: "/skills/web/vite.svg",
				url: "https://vitejs.dev/",
			},
			{
				name: "Strapi",
				logoPath: "/skills/web/strapi.svg",
				url: "https://strapi.io/",
			},
			{
				name: "Figma",
				logoPath: "/skills/web/figma.svg",
				url: "https://www.figma.com/",
			},
		],
	},
	{
		id: "programming",
		label: "Programmation",
		icon: Code2,
		skills: [
			{
				name: "Ada",
				logoPath: "/skills/prog/ada.svg",
				url: "https://www.adacore.com/about-ada",
			},
			{
				name: "Python",
				logoPath: "/skills/prog/python.svg",
				url: "https://www.python.org/",
			},
			{
				name: "Rust",
				logoPath: "/skills/prog/rust.svg",
				url: "https://www.rust-lang.org/",
			},
			{
				name: "C",
				logoPath: "/skills/prog/c.svg",
				url: "https://en.cppreference.com/w/c",
			},
			{
				name: "Java",
				logoPath: "/skills/prog/java.svg",
				url: "https://www.oracle.com/java/",
			},
			{
				name: "Bash",
				logoPath: "/skills/prog/bash.svg",
				url: "https://www.gnu.org/software/bash/",
			},
		],
	},
	{
		id: "networking",
		label: "Réseau",
		icon: Network,
		skills: [
			{
				name: "Switch",
				logoPath: "/skills/network/switch.png",
				url: "https://en.wikipedia.org/wiki/Network_switch",
			},
			{
				name: "Routeur",
				logoPath: "/skills/network/router.svg",
				url: "https://en.wikipedia.org/wiki/Router_(computing)",
			},
			{
				name: "Cisco",
				logoPath: "/skills/network/cisco.svg",
				url: "https://www.cisco.com/",
			},
			{
				name: "Frame Relay",
				logoPath: "/skills/network/frame-relay.svg",
				url: "https://en.wikipedia.org/wiki/Frame_Relay",
			},
			{
				name: "TCP",
				logoPath: "/skills/network/tcp.png",
				url: "https://www.ietf.org/rfc/rfc793.txt",
			},
			{
				name: "UDP",
				logoPath: "/skills/network/udp.png",
				url: "https://www.ietf.org/rfc/rfc768.txt",
			},
			{
				name: "X.25",
				logoPath: "/skills/network/x25.svg",
				url: "https://en.wikipedia.org/wiki/X.25",
			},
			{
				name: "ATM",
				logoPath: "/skills/network/atm.png",
				url: "https://en.wikipedia.org/wiki/Asynchronous_Transfer_Mode",
			},
			{
				name: "Wireshark",
				logoPath: "/skills/network/wireshark.svg",
				url: "https://www.wireshark.org/",
			},
			{
				name: "HTTP",
				logoPath: "/skills/network/http.png",
				url: "https://developer.mozilla.org/en-US/docs/Web/HTTP",
			},
			{
				name: "DNS",
				logoPath: "/skills/network/dns.png",
				url: "https://www.cloudflare.com/learning/dns/what-is-dns/",
			},
			{
				name: "DHCP",
				logoPath: "/skills/network/dhcp.png",
				url: "https://www.isc.org/dhcp/",
			},
			{
				name: "MPLS",
				logoPath: "/skills/network/mpls.png",
				url: "https://en.wikipedia.org/wiki/Multiprotocol_Label_Switching",
			},
			{
				name: "OSPF",
				logoPath: "/skills/network/ospf.png",
				url: "https://en.wikipedia.org/wiki/Open_Shortest_Path_First",
			},
			{
				name: "BGP",
				logoPath: "/skills/network/bgp.png",
				url: "https://www.cloudflare.com/learning/network-layer/what-is-bgp/",
			},
		],
	},
	{
		id: "infrastructure",
		label: "Infrastructure",
		icon: Server,
		skills: [
			{
				name: "Docker",
				logoPath: "/skills/infra/docker.svg",
				url: "https://www.docker.com/",
			},
			{
				name: "Kubernetes",
				logoPath: "/skills/infra/kubernetes.svg",
				url: "https://kubernetes.io/",
			},
			{
				name: "Podman",
				logoPath: "/skills/infra/podman.svg",
				url: "https://podman.io/",
			},
			{
				name: "Helm",
				logoPath: "/skills/infra/helm.svg",
				url: "https://helm.sh/",
			},
			{
				name: "Linux",
				logoPath: "/skills/infra/linux.svg",
				url: "https://www.kernel.org/",
			},
			{
				name: "Cert-manager",
				logoPath: "/skills/infra/cert-manager.svg",
				url: "https://cert-manager.io/",
			},
			{
				name: "Envoy Proxy",
				logoPath: "/skills/infra/envoy-proxy.svg",
				url: "https://www.envoyproxy.io/",
			},
		],
	},
	{
		id: "security",
		label: "Cyber",
		icon: ShieldCheck,
		skills: [
			{
				name: "Crowdsec",
				logoPath: "/skills/cyber/crowdsec.svg",
				url: "https://www.crowdsec.net/",
			},
			{
				name: "Wireguard",
				logoPath: "/skills/cyber/wireguard.svg",
				url: "https://www.wireguard.com",
			},
			{
				name: "TOR",
				logoPath: "/skills/cyber/torproject.svg",
				url: "https://www.torproject.org/",
			},
		],
	},
	{
		id: "devops",
		label: "DevOps",
		icon: InfinityLogo,
		skills: [
			{
				name: "Git",
				logoPath: "/skills/devops/git.svg",
				url: "https://git-scm.com/",
			},
			{
				name: "Ansible",
				logoPath: "/skills/devops/ansible.svg",
				url: "https://www.ansible.com/",
			},
			{
				name: "GitLab CI/CD",
				logoPath: "/skills/devops/gitlab.svg",
				url: "https://docs.gitlab.com/ee/ci/",
			},
			{
				name: "GitHub Actions",
				logoPath: "/skills/devops/github-actions.svg",
				url: "https://github.com/features/actions",
			},
			{
				name: "Dependabot",
				logoPath: "/skills/devops/dependabot.svg",
				url: "https://github.com/dependabot",
			},
			{
				name: "Renovate",
				logoPath: "/skills/devops/renovate.svg",
				url: "https://www.mend.io/renovate/",
			},
			{
				name: "Jenkins",
				logoPath: "/skills/devops/jenkins.svg",
				url: "https://www.jenkins.io/",
			},
			{
				name: "Antora",
				logoPath: "/skills/devops/antora.svg",
				url: "https://antora.org/",
			},
			{
				name: "Luigi",
				logoPath: "/skills/devops/luigi.png",
				url: "https://github.com/spotify/luigi",
			},
			{
				name: "Argo Workflow",
				logoPath: "/skills/devops/argo.svg",
				url: "https://argoproj.github.io/workflows/",
			},
			{
				name: "n8n",
				logoPath: "/skills/devops/n8n.svg",
				url: "https://n8n.io/",
			},
			{
				name: "SonarQube",
				logoPath: "/skills/devops/sonarqube.svg",
				url: "https://www.sonarqube.org/",
			},
			{
				name: "Material for Mkdocs",
				logoPath: "/skills/devops/material-for-mkdocs.svg",
				url: "https://squidfunk.github.io/mkdocs-material/",
			},
		],
	},
];
