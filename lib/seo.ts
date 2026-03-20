/** Canonical site URL for meta, JSON-LD, and prerender (no trailing slash). */
export const SITE_ORIGIN = 'https://pcstyle.dev';

/** Add your public LinkedIn profile URL for schema.org sameAs (leave empty to omit). */
export const PROFILE_LINKEDIN = '';

export const PROFILE_GITHUB_ORG = 'https://github.com/pc-style';

export function sameAsUrls(): string[] {
  const urls = [PROFILE_GITHUB_ORG];
  if (PROFILE_LINKEDIN.trim().length > 0) {
    urls.push(PROFILE_LINKEDIN.trim());
  }
  return urls;
}

export function ogImageParams(title: string, subtitle: string, icon = 'globe') {
  const params = new URLSearchParams({
    title,
    subtitle,
    icon,
    theme: 'magenta',
  });
  return `https://og.pcstyle.dev/api/og?${params.toString()}`;
}

export const SEO_COPY = {
  home: {
    title: 'Adam Krupa — Frontend designer & UI engineer | pcstyle.dev',
    description:
      'Adam Krupa (pcstyle.dev): frontend designer and UI engineer building React interfaces, design systems, and performance-minded web experiences. Portfolio and selected work.',
    path: '/',
  },
  identity: {
    title: 'About Adam Krupa — Frontend designer & engineer | pcstyle.dev',
    description:
      'About Adam Krupa: frontend designer and UI engineer, AI student at Politechnika Częstochowska. Privacy-first engineering, editorial UI, and contact via pcstyle.dev.',
    path: '/identity',
  },
  hire: {
    title: 'Hire Adam Krupa — Frontend design & UI engineering | pcstyle.dev',
    description:
      'Hire Adam Krupa for frontend design, UI implementation in React and TypeScript, design systems, accessibility, and performance. Process, stack, and FAQ.',
    path: '/hire',
  },
} as const;

export function buildPersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Adam Krupa',
    url: `${SITE_ORIGIN}/`,
    image: `${SITE_ORIGIN}/pfp.png`,
    jobTitle: 'Frontend designer & UI engineer',
    email: 'AdamKrupa@Tuta.io',
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Politechnika Częstochowska',
    },
    knowsAbout: [
      'Frontend development',
      'User interface design',
      'React',
      'TypeScript',
      'Design systems',
      'Web accessibility',
      'Web performance',
      'Human–computer interaction',
    ],
    sameAs: sameAsUrls(),
  };
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'pcstyle.dev',
    url: `${SITE_ORIGIN}/`,
    description: SEO_COPY.home.description,
    author: {
      '@type': 'Person',
      name: 'Adam Krupa',
      url: `${SITE_ORIGIN}/identity`,
    },
  };
}

export type FaqItem = { question: string; answer: string };

export function buildFaqPageJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/** FAQ content mirrored in Hire page visible text and JSON-LD. */
export const HIRE_FAQ: FaqItem[] = [
  {
    question: 'What does Adam Krupa do as a frontend designer?',
    answer:
      'Adam Krupa partners with developers and teams to design and implement interfaces: layout systems, component libraries in React, typography and motion that respect performance, and accessible patterns (WCAG-oriented). The focus is shipping UI that stays fast and legible in production.',
  },
  {
    question: 'Which technologies does Adam Krupa work with?',
    answer:
      'Primary work is in React, TypeScript, and modern CSS (including Tailwind-style utility workflows where appropriate). Adam collaborates on APIs and design tokens, cares about Core Web Vitals, and documents decisions so engineering teams can extend the system.',
  },
  {
    question: 'How do projects typically start?',
    answer:
      'Engagements usually begin with goals, constraints, and technical context (repo, design files, analytics if available). Adam proposes a short plan—information architecture, component inventory, and milestones—then iterates in small vertical slices so design and implementation stay aligned.',
  },
  {
    question: 'Where is Adam Krupa based and how can I contact him?',
    answer:
      'Adam Krupa studies at Politechnika Częstochowska in Poland and publishes work at pcstyle.dev. The fastest contact path is email at AdamKrupa@Tuta.io; GitHub is github.com/pc-style.',
  },
];
