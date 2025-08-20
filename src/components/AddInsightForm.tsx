import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Lightbulb } from 'lucide-react';
import { Insight, Snapshot } from '@/types';
import { generateId, saveInsight } from '@/lib/storage';

interface AddInsightFormProps {
  projectId: string;
  snapshots: Snapshot[];
  onInsightAdded: (insight: Insight) => void;
}

export const AddInsightForm = ({ projectId, snapshots, onInsightAdded }: AddInsightFormProps) => {
  const [content, setContent] = useState('');
  const [relatedSnapshotId, setRelatedSnapshotId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    const newInsight: Insight = {
      id: generateId(),
      projectId,
      content: content.trim(),
      timestamp: new Date(),
      relatedSnapshotId: relatedSnapshotId || undefined
    };

    saveInsight(newInsight);
    onInsightAdded(newInsight);
    
    setContent('');
    setRelatedSnapshotId('');
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <Card 
        className="p-4 cursor-pointer bg-gradient-card border-dashed border-warm-orange/30 hover:border-warm-orange/50 transition-colors"
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <Lightbulb className="w-4 h-4" />
          <span>Log an insight...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-card border-warm-orange/20">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-warm-orange" />
          <Label className="font-medium">New Insight</Label>
        </div>
        
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What did you learn? What clicked? What broke?"
          className="min-h-24"
          autoFocus
          required
        />
        
        {snapshots.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm">Related Snapshot (optional)</Label>
            <Select value={relatedSnapshotId} onValueChange={setRelatedSnapshotId}>
              <SelectTrigger>
                <SelectValue placeholder="Link to a snapshot..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {snapshots.map((snapshot) => (
                  <SelectItem key={snapshot.id} value={snapshot.id}>
                    {snapshot.content.slice(0, 50)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
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
            className="flex-1 bg-gradient-warm hover:opacity-90"
            disabled={!content.trim()}
          >
            Save Insight
          </Button>
        </div>
      </form>
    </Card>
  );
};