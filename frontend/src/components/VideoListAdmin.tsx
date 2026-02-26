import { Trash2, Loader2, Video as VideoIcon, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { type Video } from '../backend';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../lib/utils';
import { useGetAllVideos, useDeleteVideo, useGetAllBatches } from '../hooks/useQueries';

export default function VideoListAdmin() {
  const { data: videos = [], isLoading } = useGetAllVideos();
  const { data: batches = [] } = useGetAllBatches();
  const deleteVideo = useDeleteVideo();

  const getBatchName = (batchId: string) => {
    return batches.find((b) => b.id === batchId)?.name ?? 'Unknown Batch';
  };

  const handleDelete = async (video: Video) => {
    try {
      await deleteVideo.mutateAsync(video.id);
      toast.success(`"${video.title}" deleted`);
    } catch {
      toast.error('Failed to delete video');
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <Skeleton className="aspect-video w-full" />
            <CardContent className="p-3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <VideoIcon className="h-10 w-10 mx-auto mb-3 opacity-40" />
        <p className="font-medium">No videos uploaded yet</p>
        <p className="text-sm mt-1">Use the form above to upload your first video</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video) => (
        <Card key={video.id} className="overflow-hidden border-border hover:border-primary/30 transition-colors">
          {/* Thumbnail */}
          <div className="relative aspect-video bg-muted overflow-hidden">
            {video.thumbnailUrl ? (
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fb = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fb) fb.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-teal/10 to-amber/10"
              style={{ display: video.thumbnailUrl ? 'none' : 'flex' }}
            >
              <VideoIcon className="h-8 w-8 text-muted-foreground/40" />
            </div>
          </div>

          <CardContent className="p-3">
            <h3 className="font-semibold text-sm text-foreground line-clamp-1 mb-1">{video.title}</h3>
            <p className="text-xs text-muted-foreground mb-1">{video.subject}</p>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
              Batch: {getBatchName(video.batchId)}
            </p>
            <div className="flex items-center justify-between gap-2">
              <Badge variant="outline" className={`text-xs ${CATEGORY_COLORS[video.category]}`}>
                {CATEGORY_LABELS[video.category]}
              </Badge>
              <div className="flex gap-1">
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-border hover:bg-accent transition-colors"
                  title="Open video"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 text-destructive border-destructive/30 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Video</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{video.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(video)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {deleteVideo.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
