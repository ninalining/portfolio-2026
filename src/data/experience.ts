import type { Experience } from '@/types/experience'

export const experiences: Experience[] = [
  {
    id: 'acme-corp-senior-engineer-2023',
    company: 'Acme Corp',
    role: 'Senior Full-Stack Engineer',
    startDate: '2023-02',
    endDate: null,
    location: 'Stockholm, Sweden (Hybrid)',
    responsibilities: [
      'Architected and delivered a greenfield Next.js 14 platform serving 500k monthly active users, reducing Time-to-First-Byte by 40% through edge caching and RSC optimisation.',
      'Led a squad of 4 engineers through a design-system migration from inline styles to Tailwind CSS v4, eliminating 12k lines of legacy CSS.',
      'Established CI/CD pipelines with GitHub Actions — lint, type-check, unit test, and Playwright E2E gates on every PR, reducing production incidents by 60%.',
    ],
    technologies: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'PostgreSQL',
      'Vercel',
      'GitHub Actions',
    ],
  },
  {
    id: 'startup-ab-fullstack-2021',
    company: 'Startup AB',
    role: 'Full-Stack Developer',
    startDate: '2021-05',
    endDate: '2023-01',
    location: 'Remote',
    responsibilities: [
      'Built and maintained a B2B SaaS dashboard in React with a Node.js/Express REST API, supporting 200+ enterprise clients.',
      'Designed a real-time notification system using WebSockets and Redis pub/sub, cutting average response latency from 800ms to under 50ms.',
      'Drove adoption of TypeScript across the frontend codebase, onboarding the team and authoring internal migration guidelines.',
    ],
    technologies: ['React', 'Node.js', 'TypeScript', 'Redis', 'PostgreSQL', 'Docker'],
  },
]
