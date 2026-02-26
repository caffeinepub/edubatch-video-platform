import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, BookOpen, Video as VideoIcon, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import VideoCard from '../components/VideoCard';
import { Category } from '../backend';
import { CATEGORY_LABELS, CATEGORY_COLORS, categoryFromSlug } from '../lib/utils';
import { useGetVideosByCategory, useGetAllBatches } from '../hooks/useQueries';

export default function CategoryPage() {
  const { category: categorySlug } = useParams({ from: '/category/$category' });
  const category = categoryFromSlug(categorySlug) as Category;

  const { data: videos = [], isLoading: videosLoading } = useGetVideosByCategory(category);
  const { data: batches = [], isLoading: batchesLoading } = useGetAllBatches();

  const categoryBatches = batches.filter((b) => b.category === category);
  const isLoading = videosLoading || batchesLoading;

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Invalid category</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm" className="mb-4 gap-1.5 text-muted-foreground hover:text-foreground -ml-2">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            {CATEGORY_LABELS[category]}
          </h1>
          <Badge className={`text-sm px-3 py-1 ${CATEGORY_COLORS[category]}`} variant="outline">
            {videos.length} video{videos.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          {category === Category.neet
            ? 'Comprehensive NEET preparation videos covering Physics, Chemistry, and Biology.'
            : `Video lessons and study material for ${CATEGORY_LABELS[category]} students.`}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="space-y-2">
                    <Skeleton className="aspect-video w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <VideoIcon className="h-14 w-14 mx-auto mb-4 opacity-30" />
          <p className="font-medium text-lg">No videos available yet</p>
          <p className="text-sm mt-2">Content for {CATEGORY_LABELS[category]} is coming soon.</p>
          <Button asChild variant="outline" className="mt-6">
            <Link to="/">Browse Other Classes</Link>
          </Button>
        </div>
      ) : categoryBatches.length > 0 ? (
        // Group by batch
        <div className="space-y-10">
          {categoryBatches.map((batch) => {
            const batchVideos = videos.filter((v) => v.batchId === batch.id);
            if (batchVideos.length === 0) return null;
            return (
              <section key={batch.id}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-heading font-semibold text-lg text-foreground">{batch.name}</h2>
                    {batch.description && (
                      <p className="text-xs text-muted-foreground">{batch.description}</p>
                    )}
                  </div>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {batchVideos.length} video{batchVideos.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {batchVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </section>
            );
          })}
          {/* Videos without a matching batch */}
          {(() => {
            const batchIds = new Set(categoryBatches.map((b) => b.id));
            const orphanVideos = videos.filter((v) => !batchIds.has(v.batchId));
            if (orphanVideos.length === 0) return null;
            return (
              <section>
                <h2 className="font-heading font-semibold text-lg text-foreground mb-4">Other Videos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {orphanVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </section>
            );
          })()}
        </div>
      ) : (
        // No batches, just show all videos
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
