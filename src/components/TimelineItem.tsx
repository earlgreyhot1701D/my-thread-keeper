import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TimelineItem as TimelineItemType } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Code2, Lightbulb, Tag } from 'lucide-react';

interface TimelineItemProps {
  item: TimelineItemType;
}

export const TimelineItem = ({ item }: TimelineItemProps) => {
  const isSnapshot = item.type === 'snapshot';
  
  return (
    <Card className="p-4 bg-gradient-card border-border/50 hover:shadow-soft transition-shadow">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {isSnapshot ? (
            <Code2 className="w-4 h-4 text-soft-blue" />
          ) : (
            <Lightbulb className="w-4 h-4 text-warm-orange" />
          )}
          <Badge variant={isSnapshot ? "secondary" : "outline"} className="text-xs">
            {isSnapshot ? "Snapshot" : "Insight"}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
            <Clock className="w-3 h-3" />
            <span>{formatDistanceToNow(item.timestamp)} ago</span>
          </div>
        </div>
        
        <div className="prose prose-sm max-w-none">
          <p className="text-foreground whitespace-pre-wrap leading-relaxed">
            {item.content}
          </p>
        </div>
        
        {isSnapshot && 'tags' in item && item.tags.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t border-border/30">
            <Tag className="w-3 h-3 text-muted-foreground" />
            <div className="flex gap-1 flex-wrap">
              {item.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {!isSnapshot && 'relatedSnapshotId' in item && item.relatedSnapshotId && (
          <div className="text-xs text-warm-purple pt-2 border-t border-border/30">
            Related to snapshot: {item.relatedSnapshotId.slice(0, 8)}...
          </div>
        )}
      </div>
    </Card>
  );
};