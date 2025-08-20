export interface Project {
  id: string;
  title: string;
  goal: string;
  stretchGoal?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Snapshot {
  id: string;
  projectId: string;
  content: string;
  tags: string[];
  timestamp: Date;
}

export interface Insight {
  id: string;
  projectId: string;
  content: string;
  timestamp: Date;
  relatedSnapshotId?: string;
}

export type TimelineItem = (Snapshot | Insight) & {
  type: 'snapshot' | 'insight';
};