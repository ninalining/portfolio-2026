import type { Project } from '@/types/project'

export const projects: Project[] = [
  {
    slug: 'portfolio-2026',
    title: 'Portfolio 2026',
    summary:
      'This portfolio — a production-grade Next.js 16 application with App Router, next-intl i18n (EN/SV), design token system, and incremental feature delivery via a spec-driven workflow.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS v4', 'next-intl', 'Vercel'],
    accent: 'mint',
    liveUrl: 'https://ninali.dev',
    githubUrl: 'https://github.com/ninali/portfolio-2026',
  },
  {
    slug: 'saas-dashboard',
    title: 'B2B SaaS Dashboard',
    summary:
      'A real-time analytics dashboard for enterprise clients, featuring WebSocket-driven live updates, role-based access control, and a fully typed React component library.',
    tags: ['React', 'TypeScript', 'Node.js', 'WebSockets', 'Redis', 'PostgreSQL'],
    accent: 'yellow',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    githubUrl: 'https://github.com/ninali/saas-dashboard',
  },
  {
    slug: 'e-commerce-platform',
    title: 'E-Commerce Platform',
    summary:
      'A headless e-commerce storefront built with Next.js and a custom CMS integration, delivering sub-second page loads via ISR and achieving a perfect Lighthouse performance score.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Storyblok', 'Vercel'],
    accent: 'lavender',
    coverImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
    liveUrl: 'https://shop.example.com',
  },
]
