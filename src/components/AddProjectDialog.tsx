import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { Project } from '@/types';
import { generateId, saveProject } from '@/lib/storage';

interface AddProjectDialogProps {
  onProjectAdded: (project: Project) => void;
}

export const AddProjectDialog = ({ onProjectAdded }: AddProjectDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    goal: '',
    stretchGoal: '',
    status: 'Planning'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.goal.trim()) return;

    const newProject: Project = {
      id: generateId(),
      title: formData.title.trim(),
      goal: formData.goal.trim(),
      stretchGoal: formData.stretchGoal.trim() || undefined,
      status: formData.status,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    saveProject(newProject);
    onProjectAdded(newProject);
    
    setFormData({ title: '', goal: '', stretchGoal: '', status: 'Planning' });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What are you building?"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goal">Goal</Label>
            <Textarea
              id="goal"
              value={formData.goal}
              onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
              placeholder="What do you want to achieve?"
              className="min-h-20"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stretchGoal">Stretch Goal (optional)</Label>
            <Textarea
              id="stretchGoal"
              value={formData.stretchGoal}
              onChange={(e) => setFormData(prev => ({ ...prev, stretchGoal: e.target.value }))}
              placeholder="Dream bigger..."
              className="min-h-16"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Input
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              placeholder="Planning, Building, Testing..."
            />
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-primary hover:opacity-90">
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};