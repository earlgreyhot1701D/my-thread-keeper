import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Code2, Tag } from 'lucide-react';
import { Snapshot } from '@/types';
import { generateId, saveSnapshot } from '@/lib/storage';

interface AddSnapshotFormProps {
  projectId: string;
  onSnapshotAdded: (snapshot: Snapshot) => void;
}

export const AddSnapshotForm = ({ projectId, onSnapshotAdded }: AddSnapshotFormProps) => {
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const newSnapshot: Snapshot = {
      id: generateId(),
      projectId,
      content: content.trim(),
      tags,
      timestamp: new Date()
    };

    saveSnapshot(newSnapshot);
    onSnapshotAdded(newSnapshot);
    
    setContent('');
    setTagsInput('');
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <Card 
        className="p-4 cursor-pointer bg-gradient-card border-dashed border-primary/30 hover:border-primary/50 transition-colors"
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <Code2 className="w-4 h-4" />
          <span>Save a snapshot...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-card border-primary/20">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Code2 className="w-4 h-4 text-soft-blue" />
          <Label className="font-medium">New Snapshot</Label>
        </div>
        
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Code, output, or anything you want to remember..."
          className="min-h-32 font-mono text-sm"
          autoFocus
          required
        />
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Tag className="w-3 h-3 text-muted-foreground" />
            <Label htmlFor="tags" className="text-sm">Tags (comma-separated)</Label>
          </div>
          <Input
            id="tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="bug-fix, working, needs-review..."
            className="text-sm"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => setIsExpanded(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1 bg-gradient-primary hover:opacity-90"
            disabled={!content.trim()}
          >
            Save Snapshot
          </Button>
        </div>
      </form>
    </Card>
  );
};