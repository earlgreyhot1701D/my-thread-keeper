import { useState, useEffect } from 'react';
import { ProjectCard } from '@/components/ProjectCard';
import { AddProjectDialog } from '@/components/AddProjectDialog';
import { Project } from '@/types';
import { getProjects } from '@/lib/storage';
import { Brain, Code2 } from 'lucide-react';

export const HomePage = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const handleProjectAdded = (project: Project) => {
    setProjects(prev => [project, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-primary">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ThreadKeeper
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-2">
            Your AI project memory. Soft version control for hard-won progress.
          </p>
          <p className="text-sm text-warm-purple font-medium">
            You built it. You forgot how. We remember.
          </p>
        </header>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">
              Projects
              {projects.length > 0 && (
                <span className="text-base text-muted-foreground font-normal ml-2">
                  ({projects.length})
                </span>
              )}
            </h2>
          </div>
          <AddProjectDialog onProjectAdded={handleProjectAdded} />
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Code2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No projects yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start tracking your coding journey and never lose a thought again.
            </p>
            <AddProjectDialog onProjectAdded={handleProjectAdded} />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects
              .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};