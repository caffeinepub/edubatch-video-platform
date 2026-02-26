import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, BookOpen, Calendar, Layers, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../lib/utils';
import { useGetVideo, useGetBatch, useGetFile } from '../hooks/useQueries';

function formatDate(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

function isMp4FileRef(url: string): boolean {
  return url.startsWith('mp4file:');
}

function getMp4FileId(url: string): string {
  return url.replace('mp4file:', '');
}

function getYouTubeEmbedUrl(url: string): string {
  const regExp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(regExp);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  return url;
}

function VideoPlayer({ videoUrl, title, thumbnailUrl }: { videoUrl: string; title: string; thumbnailUrl: string }) {
  const isYT = isYouTubeUrl(videoUrl);
  const isMp4Ref = isMp4FileRef(videoUrl);
  const fileId = isMp4Ref ? getMp4FileId(videoUrl) : '';

  const { data: fileBlob, isLoading: fileLoading } = useGetFile(fileId);

  if (isYT) {
    const embedUrl = getYouTubeEmbedUrl(videoUrl);
    return (
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (isMp4Ref) {
    if (fileLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      );
    }
    if (!fileBlob) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black">
          <p className="text-white/70 text-sm">Video file unavailable</p>
        </div>
      );
    }
    const directUrl = fileBlob.getDirectURL();
    return (
      <video
        src={directUrl}
        controls
        autoPlay={false}
        className="w-full h-full"
        poster={thumbnailUrl || undefined}
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  // Plain URL (direct mp4 link or other)
  return (
    <video
      src={videoUrl}
      controls
      className="w-full h-full"
      poster={thumbnailUrl || undefined}
    >
      Your browser does not support the video tag.
    </video>
  );
}

export default function VideoPlayerPage() {
  const { id } = useParams({ from: '/video/$id' });
  const { data: video, isLoading: videoLoading, error: videoError } = useGetVideo(id);
  const { data: batch, isLoading: batchLoading } = useGetBatch(video?.batchId ?? '');

  if (videoLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="aspect-video w-full rounded-xl mb-6" />
        <Skeleton className="h-8 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (videoError || !video) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground text-lg mb-4">Video not found</p>
        <Button asChild variant="outline">
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back */}
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="mb-5 gap-1.5 text-muted-foreground hover:text-foreground -ml-2"
      >
        <Link to="/category/$category" params={{ category: video.category }}>
          <ArrowLeft className="h-4 w-4" />
          Back to {CATEGORY_LABELS[video.category]}
        </Link>
      </Button>

      {/* Video Player */}
      <div className="rounded-xl overflow-hidden bg-black shadow-lg mb-6 aspect-video">
        <VideoPlayer
          videoUrl={video.videoUrl}
          title={video.title}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>

      {/* Video Info */}
      <div className="space-y-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="outline" className={`${CATEGORY_COLORS[video.category]}`}>
              {CATEGORY_LABELS[video.category]}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {video.subject}
            </Badge>
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{video.title}</h1>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="border-border">
            <CardContent className="p-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Subject</p>
                <p className="text-sm font-medium">{video.subject}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-3 flex items-center gap-2">
              <Layers className="h-4 w-4 text-teal shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Batch</p>
                <p className="text-sm font-medium line-clamp-1">
                  {batchLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : (batch?.name ?? 'Unknown')}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Uploaded</p>
                <p className="text-sm font-medium">{formatDate(video.uploadedAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        {video.description && (
          <Card className="border-border">
            <CardContent className="p-4">
              <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">About this video</h2>
              <p className="text-foreground leading-relaxed">{video.description}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
