import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TimelineItem as TimelineItemType } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Code2, Lightbulb, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface TimelineItemProps {
  item: TimelineItemType;
}

export const TimelineItem = ({ item }: TimelineItemProps) => {
  const isSnapshot = item.type === 'snapshot';
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get preview text (first 50 characters)
  const previewText = item.content.slice(0, 50);
  const hasMoreContent = item.content.length > 50;
  
  // Check if content contains markdown checkboxes
  const hasCheckboxes = item.content.includes('- [ ]') || item.content.includes('- [x]');
  
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
        
        <div className="space-y-2">
          {hasMoreContent && !isExpanded ? (
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <p className="text-foreground leading-relaxed">
                  {previewText}...
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-1 text-xs h-auto p-1"
              >
                <ChevronDown className="w-3 h-3" />
                Expand
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {hasMoreContent && (
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(false)}
                    className="flex items-center gap-1 text-xs h-auto p-1"
                  >
                    <ChevronUp className="w-3 h-3" />
                    Collapse
                  </Button>
                </div>
              )}
              <div className="prose prose-sm max-w-none">
                {hasCheckboxes ? (
                  <div className="text-foreground leading-relaxed">
                    <ReactMarkdown 
                      components={{
                        // Custom checkbox rendering
                        input: ({ checked, ...props }) => (
                          <input 
                            type="checkbox" 
                            checked={checked} 
                            className="mr-2" 
                            readOnly 
                            {...props} 
                          />
                        ),
                        // Style list items with checkboxes
                        li: ({ children, ...props }) => (
                          <li className="list-none" {...props}>
                            {children}
                          </li>
                        ),
                        // Remove default list styling for checkbox lists
                        ul: ({ children, ...props }) => (
                          <ul className="list-none pl-0 space-y-1" {...props}>
                            {children}
                          </ul>
                        )
                      }}
                    >
                      {item.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {item.content}
                  </p>
                )}
              </div>
            </div>
          )}
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