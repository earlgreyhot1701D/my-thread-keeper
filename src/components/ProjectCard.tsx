import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/project/${project.id}`);
  };

  return (
    <Card 
      className="p-6 cursor-pointer transition-all duration-200 hover:shadow-card hover:-translate-y-1 bg-gradient-card border-border/50"
      onClick={handleClick}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold text-foreground line-clamp-2">
            {project.title}
          </h3>
          <Badge variant="secondary" className="ml-2 shrink-0">
            {project.status}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.goal}
            </p>
          </div>
          
          {project.stretchGoal && (
            <p className="text-sm text-warm-purple line-clamp-2 ml-6">
              Stretch: {project.stretchGoal}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/30">
          <Clock className="w-3 h-3" />
          <span>Updated {formatDistanceToNow(project.updatedAt)} ago</span>
        </div>
      </div>
    </Card>
  );
};