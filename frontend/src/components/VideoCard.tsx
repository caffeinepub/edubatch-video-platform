import { Link } from '@tanstack/react-router';
import { Play, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type Video } from '../backend';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../lib/utils';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link to="/video/$id" params={{ id: video.id }}>
      <Card className="group overflow-hidden hover:shadow-card-hover transition-all duration-200 cursor-pointer border-border hover:border-primary/30 h-full">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-muted overflow-hidden">
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-teal/20 to-amber/20"
            style={{ display: video.thumbnailUrl ? 'none' : 'flex' }}
          >
            <BookOpen className="h-10 w-10 text-muted-foreground/40" />
          </div>
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <div className="bg-white/90 rounded-full p-3 shadow-lg">
              <Play className="h-5 w-5 text-primary fill-primary" />
            </div>
          </div>
        </div>

        <CardContent className="p-3">
          <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1.5 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {video.subject}
            </span>
            <Badge variant="outline" className={`text-xs px-1.5 py-0 ${CATEGORY_COLORS[video.category]}`}>
              {CATEGORY_LABELS[video.category]}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
