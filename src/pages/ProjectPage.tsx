
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TimelineItem } from '@/components/TimelineItem';
import { AddSnapshotForm } from '@/components/AddSnapshotForm';
import { AddInsightModal } from '@/components/AddInsightModal';
import { EditableProjectHeader } from '@/components/EditableProjectHeader';
import { Project, Snapshot, Insight, TimelineItem as TimelineItemType } from '@/types';
import { getProjects, getSnapshots, getInsights, saveProject } from '@/lib/storage';
import { ArrowLeft, Target, Calendar, Lightbulb, Code2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const ProjectPage = () => {
  console.log('=== ProjectPage component starting to render ===');
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  console.log('ProjectPage - useParams id:', id);
  console.log('ProjectPage - typeof id:', typeof id);
  
  const [project, setProject] = useState<Project | null>(null);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [timelineItems, setTimelineItems] = useState<TimelineItemType[]>([]);

  console.log('ProjectPage - State initialized');
  console.log('ProjectPage - project state:', project);
  console.log('ProjectPage - snapshots length:', snapshots.length);
  console.log('ProjectPage - insights length:', insights.length);

  useEffect(() => {
    console.log('=== ProjectPage useEffect triggered ===');
    console.log('useEffect - id:', id);
    
    if (!id) {
      console.log('useEffect - No id found, returning early');
      return;
    }

    console.log('useEffect - Getting projects from storage...');
    const projects = getProjects();
    console.log('useEffect - All projects:', projects);
    
    const foundProject = projects.find(p => p.id === id);
    console.log('useEffect - Found project:', foundProject);
    
    if (!foundProject) {
      console.log('useEffect - Project not found, navigating to home');
      navigate('/');
      return;
    }

    console.log('useEffect - Setting project state...');
    setProject(foundProject);
    
    console.log('useEffect - Getting snapshots...');
    const projectSnapshots = getSnapshots(id);
    console.log('useEffect - Project snapshots:', projectSnapshots);
    setSnapshots(projectSnapshots);
    
    console.log('useEffect - Getting insights...');
    const projectInsights = getInsights(id);
    console.log('useEffect - Project insights:', projectInsights);
    setInsights(projectInsights);
    
    console.log('=== ProjectPage useEffect completed ===');
  }, [id, navigate]);

  useEffect(() => {
    const allItems: TimelineItemType[] = [
      ...snapshots.map(s => ({ ...s, type: 'snapshot' as const })),
      ...insights.map(i => ({ ...i, type: 'insight' as const }))
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    setTimelineItems(allItems);
  }, [snapshots, insights]);

  const handleSnapshotAdded = (snapshot: Snapshot) => {
    setSnapshots(prev => [snapshot, ...prev]);
  };

  const handleInsightAdded = (insight: Insight) => {
    setInsights(prev => [insight, ...prev]);
  };

  const handleProjectUpdate = (updatedProject: Project) => {
    saveProject(updatedProject);
    setProject(updatedProject);
  };

  console.log('ProjectPage - About to check if project exists');
  console.log('ProjectPage - project state before render:', project);
  
  if (!project) {
    console.log('ProjectPage - No project found, showing loading...');
    return <div>Loading...</div>;
  }
  
  console.log('ProjectPage - Project found, rendering main content');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <header className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
          
          <div className="space-y-4">
            <EditableProjectHeader 
              project={project} 
              onProjectUpdate={handleProjectUpdate}
            />
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Updated {formatDistanceToNow(project.updatedAt)} ago</span>
              </div>
              <span className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                {project.status}
              </span>
            </div>
          </div>
        </header>

        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="snapshots" className="flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              Snapshots ({snapshots.length})
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Insights ({insights.length})
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <AddSnapshotForm projectId={project.id} onSnapshotAdded={handleSnapshotAdded} />
              <AddInsightModal 
                projectId={project.id} 
                snapshots={snapshots}
                onInsightAdded={handleInsightAdded}
              >
                <Button className="w-full h-auto p-4 bg-gradient-card border-dashed border-warm-orange/30 hover:border-warm-orange/50 transition-colors">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Lightbulb className="w-4 h-4" />
                    <span>Log an insight...</span>
                  </div>
                </Button>
              </AddInsightModal>
            </div>
            
            {timelineItems.length === 0 ? (
              <Card className="p-8 text-center bg-gradient-card">
                <p className="text-muted-foreground">
                  No entries yet. Start by saving a snapshot or logging an insight above.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {timelineItems.map((item) => (
                  <TimelineItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="snapshots" className="space-y-4">
            <AddSnapshotForm projectId={project.id} onSnapshotAdded={handleSnapshotAdded} />
            
            {snapshots.length === 0 ? (
              <Card className="p-8 text-center bg-gradient-card">
                <Code2 className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No snapshots yet. Save your first piece of code or output above.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {snapshots.map((snapshot) => (
                  <TimelineItem key={snapshot.id} item={{ ...snapshot, type: 'snapshot' }} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <AddInsightModal 
              projectId={project.id} 
              snapshots={snapshots}
              onInsightAdded={handleInsightAdded}
            >
              <Button className="w-full h-auto p-4 bg-gradient-card border-dashed border-warm-orange/30 hover:border-warm-orange/50 transition-colors">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Lightbulb className="w-4 h-4" />
                  <span>Log an insight...</span>
                </div>
              </Button>
            </AddInsightModal>
            
            {insights.length === 0 ? (
              <Card className="p-8 text-center bg-gradient-card">
                <Lightbulb className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No insights yet. Log your first learning or breakthrough above.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {insights.map((insight) => (
                  <TimelineItem key={insight.id} item={{ ...insight, type: 'insight' }} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="p-6 bg-gradient-card">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-primary mt-0.5" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Goal</h3>
                    <p className="text-muted-foreground leading-relaxed">{project.goal}</p>
                  </div>
                </div>
                
                {project.stretchGoal && (
                  <div className="flex items-start gap-3 pt-4 border-t border-border/30">
                    <Target className="w-5 h-5 text-warm-purple mt-0.5" />
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">Stretch Goal</h3>
                      <p className="text-muted-foreground leading-relaxed">{project.stretchGoal}</p>
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-border/30">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">Status</span>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectPage;
