export type ProjectStatus = 'active' | 'maintenance' | 'experimental' | 'prototype' | 'disabled'

/** Evidence line in a project casefile (links, commits, benchmarks). */
export interface CasefileEvidence {
  label: string
  detail?: string
  href?: string
}

/** Timeline node for casefile narrative. */
export interface CasefileTimelineEvent {
  at: string
  title: string
  detail?: string
}

/** Detective-board style deep dive for a project. */
export interface ProjectCasefile {
  problem: string
  constraints: string
  failedAttempts?: string[]
  breakthrough: string
  outcome: string
  timeline?: CasefileTimelineEvent[]
  evidence?: CasefileEvidence[]
}

export interface ProjectModalData {
  title: string
  /** Long-form overview; optional when `casefile` carries the story. */
  content?: string
  casefile?: ProjectCasefile
}

export interface Project {
  id: string
  name: string
  desc: string
  stack: string[]
  link?: string
  github?: string
  status: ProjectStatus
  pinned?: boolean
  icon: string
  createdAt: string
  updatedAt: string
  modal?: ProjectModalData
}

export interface ProjectsData {
  projects: Project[]
  lastUpdated: string
}

// wakatime types
export interface WakaTimeLanguage {
  name: string
  totalSeconds: number
  percent: number
}

export interface WakaTimeEditor {
  name: string
  totalSeconds: number
  percent: number
}

export interface WakaTimeProject {
  name: string
  totalSeconds: number
  percent: number
}

export interface WakaTimeSummary {
  totalSeconds: number
  totalHours: number
  dailyAverage: number
  languages: WakaTimeLanguage[]
  editors: WakaTimeEditor[]
  projects: WakaTimeProject[]
  bestDay: { date: string; seconds: number } | null
  range: { start: string; end: string }
  /** Present when stats are modeled from GitHub (commits, repos) instead of WakaTime */
  source?: 'github-inferred' | 'wakatime'
}

export interface WakaTimeStatus {
  isActive: boolean
  project: string | null
  language: string | null
  editor: string | null
  lastHeartbeat: string | null
}

// github types
export interface GitHubContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
  /** Hex from GitHub API — use for fills so intensity matches your profile graph */
  color?: string
}

export interface GitHubContributions {
  totalContributions: number
  weeks: GitHubContributionDay[][]
}

/** Snapshot for “recent repos” lists (from GitHub REST, sorted by last push). */
export interface GitHubRecentRepo {
  name: string
  fullName: string
  description: string | null
  pushedAt: string
  createdAt: string
  stars: number
  language: string | null
  url: string
  fork: boolean
  private?: boolean
}

/** Rolling 7-day window (UTC) from GitHub GraphQL + search. */
export interface GitHubSevenDayMetrics {
  from: string
  to: string
  /** contributionsCollection.totalCommitContributions */
  commitContributions: number
  /** Merged PRs authored by you (search issueCount; may exceed 100). */
  mergedPrs: number
  /** Sum of `additions` on first page of merged PRs (max 100). */
  linesAddedMergedPrs: number
  /** True when mergedPrs > 100 — line sum is a lower bound. */
  linesPartial?: boolean
}

export interface GitHubStats {
  publicRepos: number
  followers: number
  following: number
  totalStars: number
  /** When token matches GITHUB_USERNAME (`/user`). */
  totalPrivateRepos?: number
  /** public + private owned, when authenticated as that user. */
  totalOwnedRepos?: number
  totalCommits?: number
  lastCommit?: {
    message: string
    repo: string
    date: string
    url: string
  }
  mostActiveRepo?: {
    name: string
    url: string
    commits: number
  }
  recentRepos?: GitHubRecentRepo[]
  sevenDay?: GitHubSevenDayMetrics
}

// combined live status for navbar
export interface CodingStatus {
  isActive: boolean
  project: string | null
  language: string | null
  lastActivity: string | null
}
