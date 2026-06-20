export interface SuccessStory {
  id: string;
  name: string;
  role: string;
  outcome: string;
  quote: string;
  avatar: string;
  logo: string; // Company transitioned to
}

export interface FeaturedProject {
  id: string;
  title: string;
  description: string;
  metrics: string;
  tech: string[];
  githubUrl?: string;
  deployUrl?: string;
}

export interface ImpactMetric {
  label: string;
  value: string;
  trend: string;
  description: string;
}

export interface AnnualMilestone {
  year: string;
  title: string;
  description: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: string;
}

export const IMPACT_METRICS: ImpactMetric[] = [
  {
    label: "ACTIVE_DEVELOPERS",
    value: "2,400+",
    trend: "+42% YoY",
    description: "Vetted students from Maharaja Agrasen Institute of Technology actively committing code."
  },
  {
    label: "PROJECTS_SHIPPED",
    value: "180+",
    trend: "+65% YoY",
    description: "Production-grade microservices, visual applications, and library architectures compiled."
  },
  {
    label: "COMPETITIVE_PLACEMENTS",
    value: "45+",
    trend: "Top 3 Finishes",
    description: "National-scale hackathons, algorithmic sprints, and open-source challenges claimed."
  },
  {
    label: "CREDENTIALS_ISSUED",
    value: "800+",
    trend: "Verifiable Ledger",
    description: "Peer-reviewed, cryptographic system certifications minted directly to student profiles."
  }
];

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: "story-1",
    name: "Aaditya Garg",
    role: "L3 Fellow • Staff Engineer",
    outcome: "Secured Systems Engineer role at Google",
    quote: "At Codezen, I transitioned from writing basic scripts to designing high-concurrency RPC microservices. The focus on system design and peer review defines your entire professional pathway.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    logo: "Google"
  },
  {
    id: "story-2",
    name: "Devvrat Saini",
    role: "L4 Guild Lead",
    outcome: "Founded Web3 decentralized network with $2M seed",
    quote: "The Codezen community functions like a high-density incubator. We didn't learn from textbooks; we collaborated on real node instances under high industrial constraints.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    logo: "Stripe"
  },
  {
    id: "story-3",
    name: "Rohan Khanna",
    role: "L2 Open Source Maintainer",
    outcome: "Core contributor to major bundler tools",
    quote: "Designing fast developer interfaces inside Codezen taught me the value of millisecond-level responsiveness. It's a network that actively promotes craftsmanship over lazy styling.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    logo: "Vercel"
  }
];

export const HARDWARE_PARTNERS = [
  { name: "Google Cloud", category: "Infrastructure" },
  { name: "GitHub", category: "Open Source" },
  { name: "Vercel", category: "Deployment Edge" },
  { name: "MongoDB", category: "Data Storage" },
  { name: "Postman", category: "API Workspace" },
  { name: "Clerk", category: "Identity Provision" }
];

export const LEADERSHIP_STEPS = [
  {
    step: "01",
    phase: "LEARN",
    title: "Vetted Coursework Sprints",
    description: "Complete rigorous, peer-reviewed curriculum tracks spanning neural compilers, system orchestration, and low-level data streams."
  },
  {
    step: "02",
    phase: "BUILD",
    title: "Showcase Compilation",
    description: "Construct structural utility tools, open-source library kernels, or production-grade microservices to present before the Guild council."
  },
  {
    step: "03",
    phase: "EARN",
    title: "Ledger Credentialing",
    description: "Mint secure, peer-vetted digital verification hashes to represent verified proficiency and high-fidelity project contributions."
  },
  {
    step: "04",
    phase: "LEAD",
    title: "Council Guild Stewardship",
    description: "Step into council leadership. Moderate active courses, structure peer wisdom streams, lead national hack squads, and orchestrate innovation labs."
  }
];

export const ANNUAL_ACHIEVEMENTS: AnnualMilestone[] = [
  {
    year: "2026",
    title: "Zenith Mainframe Scale",
    description: "Inaugurated the automated student sandboxed sandbox compiler. Integrated zero-knowledge proof standards for verified credentials."
  },
  {
    year: "2025",
    title: "Incubator Expansion Sprints",
    description: "Launched internal dev seed funding. 3 student startups raised primary funding rounds directly out of the Codezen labs."
  },
  {
    year: "2024",
    title: "Foundation of Roster",
    description: "Bootstrapped the peer-review compiler system at MAIT. Deployed internal Discord integrations checking over 12,000 algorithmic submissions."
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g-1",
    title: "Zenith Hackathon 2026 Laboratory",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
    category: "LABORATORY"
  },
  {
    id: "g-2",
    title: "UI Design System Review Session",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
    category: "CRITIQUE"
  },
  {
    id: "g-3",
    title: "Neural Network Compilers Workshop",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    category: "LECTURES"
  },
  {
    id: "g-4",
    title: "DevOps Systems Continuous Deployment Core",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=800",
    category: "COLLABORATION"
  }
];
