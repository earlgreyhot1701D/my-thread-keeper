import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lightbulb } from 'lucide-react';
import { Insight, Snapshot } from '@/types';
import { generateId, saveInsight } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface AddInsightModalProps {
  projectId: string;
  snapshots: Snapshot[];
  onInsightAdded: (insight: Insight) => void;
  children: React.ReactNode;
}

export const AddInsightModal = ({ projectId, snapshots, onInsightAdded, children }: AddInsightModalProps) => {
  const [content, setContent] = useState('');
  const [relatedSnapshotId, setRelatedSnapshotId] = useState<string>('');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  console.log('AddInsightModal rendered with projectId:', projectId);

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
    
    toast({
      title: "🧠 Insight saved!",
      description: "Your insight has been added to the timeline.",
    });
    
    setContent('');
    setRelatedSnapshotId('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-warm-orange" />
            Add New Insight
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="insight-content">What did you discover, notice, or question?</Label>
            <Textarea
              id="insight-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your insight here..."
              className="min-h-24"
              required
            />
          </div>
          
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
          
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
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
      </DialogContent>
    </Dialog>
  );
};