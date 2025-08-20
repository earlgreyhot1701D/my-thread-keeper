import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Project } from '@/types';
import { Edit3, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EditableProjectHeaderProps {
  project: Project;
  onProjectUpdate: (project: Project) => void;
}

export const EditableProjectHeader = ({ project, onProjectUpdate }: EditableProjectHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(project.title);
  const [goal, setGoal] = useState(project.goal);
  const [stretchGoal, setStretchGoal] = useState(project.stretchGoal || '');
  const { toast } = useToast();

  const handleSave = () => {
    if (!title.trim() || !goal.trim()) {
      toast({
        title: "Error",
        description: "Project title and goal are required.",
        variant: "destructive",
      });
      return;
    }

    const updatedProject: Project = {
      ...project,
      title: title.trim(),
      goal: goal.trim(),
      stretchGoal: stretchGoal.trim() || undefined,
      updatedAt: new Date(),
    };

    onProjectUpdate(updatedProject);
    setIsEditing(false);
    
    toast({
      title: "Project updated!",
      description: "Your project overview has been saved.",
    });
  };

  const handleCancel = () => {
    setTitle(project.title);
    setGoal(project.goal);
    setStretchGoal(project.stretchGoal || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="p-6 bg-gradient-card border-primary/20">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Edit Project Overview</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="flex items-center gap-1"
              >
                <Save className="w-3 h-3" />
                Save
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Project Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title..."
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="goal" className="text-sm font-medium">
                Main Goal
              </Label>
              <Textarea
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="What are you trying to build or achieve?"
                className="mt-1 min-h-20"
              />
            </div>
            
            <div>
              <Label htmlFor="stretchGoal" className="text-sm font-medium">
                Stretch Goal (optional)
              </Label>
              <Textarea
                id="stretchGoal"
                value={stretchGoal}
                onChange={(e) => setStretchGoal(e.target.value)}
                placeholder="What would make this project even better?"
                className="mt-1 min-h-16"
              />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card hover:shadow-soft transition-shadow">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              {project.title}
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              {project.goal}
            </p>
            {project.stretchGoal && (
              <div className="pt-2 border-t border-border/30">
                <p className="text-sm text-warm-purple leading-relaxed">
                  <span className="font-medium">Stretch Goal:</span> {project.stretchGoal}
                </p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-xs"
          >
            <Edit3 className="w-3 h-3" />
            Edit
          </Button>
        </div>
      </div>
    </Card>
  );
};