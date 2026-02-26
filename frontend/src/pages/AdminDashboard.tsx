import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Settings, FolderOpen, Upload, Video, LayoutDashboard, Loader2, ShieldX } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import BatchManagementSection from '../components/BatchManagementSection';
import VideoUploadForm from '../components/VideoUploadForm';
import VideoListAdmin from '../components/VideoListAdmin';
import { useGetAllBatches, useGetAllVideos, useIsCallerAdmin } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: batches = [] } = useGetAllBatches();
  const { data: videos = [] } = useGetAllVideos();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  useEffect(() => {
    if (!adminLoading && isAdmin === false) {
      toast.error('Access denied. Admin privileges required.');
      navigate({ to: '/' });
    }
  }, [isAdmin, adminLoading, navigate]);

  if (adminLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Verifying admin access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <ShieldX className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Access Denied</h1>
        <p className="text-muted-foreground max-w-sm">
          You do not have admin privileges to access this page.
        </p>
        <Button variant="outline" onClick={() => navigate({ to: '/' })}>
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage batches and video content</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center">
              <FolderOpen className="h-4 w-4 text-teal" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground font-heading">{batches.length}</div>
              <div className="text-xs text-muted-foreground">Batches</div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber/10 flex items-center justify-center">
              <Video className="h-4 w-4 text-amber" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground font-heading">{videos.length}</div>
              <div className="text-xs text-muted-foreground">Videos</div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground font-heading">8</div>
              <div className="text-xs text-muted-foreground">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="batches" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="batches" className="gap-1.5">
            <FolderOpen className="h-3.5 w-3.5" />
            Batches
          </TabsTrigger>
          <TabsTrigger value="upload" className="gap-1.5">
            <Upload className="h-3.5 w-3.5" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="videos" className="gap-1.5">
            <Video className="h-3.5 w-3.5" />
            Videos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="batches">
          <BatchManagementSection />
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-1">Upload Video</h2>
            <p className="text-sm text-muted-foreground">Add a new video to a batch</p>
          </div>
          <VideoUploadForm />
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-1">All Videos</h2>
            <p className="text-sm text-muted-foreground">{videos.length} video{videos.length !== 1 ? 's' : ''} uploaded</p>
          </div>
          <VideoListAdmin />
        </TabsContent>
      </Tabs>
    </div>
  );
}
