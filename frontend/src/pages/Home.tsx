import { useEffect, useRef } from 'react';
import { Link } from '@tanstack/react-router';
import { BookOpen, Users, Video, ArrowRight, GraduationCap, FlaskConical, Atom, Leaf, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Category } from '../backend';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../lib/utils';
import { useGetAllBatches, useGetAllVideos, useInitialize } from '../hooks/useQueries';

const CLASS_CATEGORIES = [
  Category.class6, Category.class7, Category.class8, Category.class9,
  Category.class10, Category.class11, Category.class12,
];

const CATEGORY_ICONS: Record<string, string> = {
  [Category.class6]: '6',
  [Category.class7]: '7',
  [Category.class8]: '8',
  [Category.class9]: '9',
  [Category.class10]: '10',
  [Category.class11]: '11',
  [Category.class12]: '12',
  [Category.neet]: 'N',
};

const SUBJECT_ICONS: Record<string, React.ReactNode> = {
  Physics: <Atom className="h-4 w-4" />,
  Chemistry: <FlaskConical className="h-4 w-4" />,
  Biology: <Leaf className="h-4 w-4" />,
};

const SUBJECT_COLORS: Record<string, string> = {
  Physics: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Chemistry: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Biology: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
};

export default function Home() {
  const { data: batches = [], isLoading: batchesLoading } = useGetAllBatches();
  const { data: videos = [] } = useGetAllVideos();
  const initialize = useInitialize();
  const initCalledRef = useRef(false);

  const neetBatches = batches.filter((b) => b.category === Category.neet);
  const otherBatches = batches.filter((b) => b.category !== Category.neet);

  // Seed NEET data if no NEET batches exist yet
  useEffect(() => {
    if (!batchesLoading && neetBatches.length === 0 && !initCalledRef.current) {
      initCalledRef.current = true;
      initialize.mutate({});
    }
  }, [batchesLoading, neetBatches.length]);

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-banner.dim_1200x400.png"
            alt="Students studying"
            className="w-full h-full object-cover opacity-20"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-amber/20 text-amber-dark border-amber/30 font-medium">
                🎓 Classes 6–12 & NEET
              </Badge>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Learn Smarter,<br />
              <span className="text-primary">Achieve More</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Access expert-curated video lessons for Classes 6 to 12 and NEET preparation. 
              Organized in structured batches for focused learning.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2 bg-primary text-primary-foreground shadow-md">
                <Link to="/category/$category" params={{ category: Category.neet }}>
                  <GraduationCap className="h-5 w-5" />
                  NEET Prep
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 border-primary/30">
                <Link to="/category/$category" params={{ category: Category.class10 }}>
                  <BookOpen className="h-5 w-5" />
                  Class 10
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
            <div>
              <div className="text-2xl font-bold text-primary font-heading">{batches.length}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Batches</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary font-heading">{videos.length}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Videos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary font-heading">8</div>
              <div className="text-xs text-muted-foreground mt-0.5">Courses</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Upcoming NEET Batches ── */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-neet/15 text-neet font-bold text-sm">N</span>
              <h2 className="font-heading text-2xl font-bold text-foreground">Upcoming NEET Batches</h2>
            </div>
            <p className="text-sm text-muted-foreground">Structured programs for NEET 2025 aspirants — Physics, Chemistry & Biology</p>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-1 border-neet/30 text-neet hover:bg-neet/5 hidden sm:flex">
            <Link to="/category/$category" params={{ category: Category.neet }}>
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {batchesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="border-neet/20">
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2 pt-1">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : neetBatches.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground border border-dashed border-neet/30 rounded-xl bg-neet/5">
            <GraduationCap className="h-10 w-10 mx-auto mb-3 text-neet/40" />
            <p className="font-medium">No NEET batches available yet</p>
            <p className="text-sm mt-1">Check back soon for upcoming NEET 2025 batches.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {neetBatches.map((batch) => {
              const batchVideos = videos.filter((v) => v.batchId === batch.id);
              const subjects = Array.from(new Set(batchVideos.map((v) => v.subject)));
              return (
                <Link
                  key={batch.id}
                  to="/category/$category"
                  params={{ category: Category.neet }}
                >
                  <Card className="group h-full hover:shadow-card-hover hover:border-neet/40 transition-all cursor-pointer border-neet/20 bg-gradient-to-br from-card to-neet/5">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="w-11 h-11 rounded-xl bg-neet/15 flex items-center justify-center shrink-0">
                          <GraduationCap className="h-6 w-6 text-neet" />
                        </div>
                        <Badge className="bg-neet/10 text-neet border-neet/20 text-xs font-semibold">
                          NEET 2025
                        </Badge>
                      </div>
                      <h3 className="font-heading font-bold text-lg text-foreground mb-1 group-hover:text-neet transition-colors line-clamp-1">
                        {batch.name}
                      </h3>
                      {batch.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{batch.description}</p>
                      )}
                      {/* Subject tags */}
                      {subjects.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {subjects.map((subject) => (
                            <span
                              key={subject}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${SUBJECT_COLORS[subject] ?? 'bg-muted text-muted-foreground'}`}
                            >
                              {SUBJECT_ICONS[subject] ?? null}
                              {subject}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Video className="h-3.5 w-3.5" />
                          {batchVideos.length} video{batchVideos.length !== 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1 text-neet font-medium group-hover:gap-2 transition-all">
                          Explore batch <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-4 sm:hidden">
          <Button asChild variant="outline" size="sm" className="w-full gap-1 border-neet/30 text-neet hover:bg-neet/5">
            <Link to="/category/$category" params={{ category: Category.neet }}>
              View All NEET Content <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Browse by Class */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl font-bold text-foreground">Browse by Class</h2>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {CLASS_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to="/category/$category"
              params={{ category: cat }}
              className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-center"
            >
              <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center font-bold text-teal text-sm group-hover:bg-teal/20 transition-colors">
                {CATEGORY_ICONS[cat]}
              </div>
              <span className="text-xs font-medium text-foreground/70 group-hover:text-foreground">
                {CATEGORY_LABELS[cat]}
              </span>
            </Link>
          ))}
          <Link
            to="/category/$category"
            params={{ category: Category.neet }}
            className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-neet/30 hover:border-neet/60 hover:bg-neet/5 transition-all text-center"
          >
            <div className="w-10 h-10 rounded-full bg-neet/10 flex items-center justify-center font-bold text-neet text-sm group-hover:bg-neet/20 transition-colors">
              N
            </div>
            <span className="text-xs font-medium text-neet">NEET</span>
          </Link>
        </div>
      </section>

      {/* Other Batches */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl font-bold text-foreground">Available Batches</h2>
          <span className="text-sm text-muted-foreground">{otherBatches.length} total</span>
        </div>

        {batchesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : otherBatches.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Video className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium text-lg">No class batches available yet</p>
            <p className="text-sm mt-2">Check back soon or visit the admin panel to add content.</p>
            <Button asChild variant="outline" className="mt-4 gap-2">
              <Link to="/admin">
                <ArrowRight className="h-4 w-4" />
                Go to Admin
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherBatches.map((batch) => {
              const batchVideoCount = videos.filter((v) => v.batchId === batch.id).length;
              return (
                <Link
                  key={batch.id}
                  to="/category/$category"
                  params={{ category: batch.category }}
                >
                  <Card className="group h-full hover:shadow-card-hover hover:border-primary/30 transition-all cursor-pointer border-border">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <Badge variant="outline" className={`text-xs ${CATEGORY_COLORS[batch.category]}`}>
                          {CATEGORY_LABELS[batch.category]}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                        {batch.name}
                      </h3>
                      {batch.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{batch.description}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Video className="h-3 w-3" />
                          {batchVideoCount} video{batchVideoCount !== 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Open batch
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
