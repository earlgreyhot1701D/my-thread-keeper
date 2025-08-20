import { Project, Snapshot, Insight } from '@/types';

const STORAGE_KEYS = {
  PROJECTS: 'threadkeeper_projects',
  SNAPSHOTS: 'threadkeeper_snapshots',
  INSIGHTS: 'threadkeeper_insights'
};

// Projects
export const getProjects = (): Project[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  if (!stored) return [];
  return JSON.parse(stored).map((p: any) => ({
    ...p,
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt)
  }));
};

export const saveProject = (project: Project): void => {
  const projects = getProjects();
  const existing = projects.findIndex(p => p.id === project.id);
  
  if (existing >= 0) {
    projects[existing] = { ...project, updatedAt: new Date() };
  } else {
    projects.push(project);
  }
  
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
};

export const deleteProject = (id: string): void => {
  const projects = getProjects().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  
  // Also delete related snapshots and insights
  const snapshots = getSnapshots().filter(s => s.projectId !== id);
  const insights = getInsights().filter(i => i.projectId !== id);
  localStorage.setItem(STORAGE_KEYS.SNAPSHOTS, JSON.stringify(snapshots));
  localStorage.setItem(STORAGE_KEYS.INSIGHTS, JSON.stringify(insights));
};

// Snapshots
export const getSnapshots = (projectId?: string): Snapshot[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.SNAPSHOTS);
  if (!stored) return [];
  const snapshots = JSON.parse(stored).map((s: any) => ({
    ...s,
    timestamp: new Date(s.timestamp)
  }));
  return projectId ? snapshots.filter(s => s.projectId === projectId) : snapshots;
};

export const saveSnapshot = (snapshot: Snapshot): void => {
  const snapshots = getSnapshots();
  snapshots.push(snapshot);
  localStorage.setItem(STORAGE_KEYS.SNAPSHOTS, JSON.stringify(snapshots));
};

// Insights
export const getInsights = (projectId?: string): Insight[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.INSIGHTS);
  if (!stored) return [];
  const insights = JSON.parse(stored).map((i: any) => ({
    ...i,
    timestamp: new Date(i.timestamp)
  }));
  return projectId ? insights.filter(i => i.projectId === projectId) : insights;
};

export const saveInsight = (insight: Insight): void => {
  const insights = getInsights();
  insights.push(insight);
  localStorage.setItem(STORAGE_KEYS.INSIGHTS, JSON.stringify(insights));
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};