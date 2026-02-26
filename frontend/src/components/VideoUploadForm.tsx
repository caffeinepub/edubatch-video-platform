import { useState, useRef } from 'react';
import { Loader2, Upload, FileVideo, Link as LinkIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Category, ExternalBlob } from '../backend';
import { CATEGORY_LABELS, generateId } from '../lib/utils';
import { useGetAllBatches, useUploadVideo, useUploadVideoFile } from '../hooks/useQueries';

const ALL_CATEGORIES = Object.values(Category);

type VideoSourceType = 'url' | 'file';

interface VideoFormState {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  subject: string;
  category: Category;
  batchId: string;
}

const defaultForm: VideoFormState = {
  title: '',
  description: '',
  videoUrl: '',
  thumbnailUrl: '',
  subject: '',
  category: Category.class6,
  batchId: '',
};

export default function VideoUploadForm() {
  const { data: batches = [] } = useGetAllBatches();
  const uploadVideo = useUploadVideo();
  const uploadVideoFile = useUploadVideoFile();

  const [form, setForm] = useState<VideoFormState>(defaultForm);
  const [sourceType, setSourceType] = useState<VideoSourceType>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.mp4') && file.type !== 'video/mp4') {
      toast.error('Only MP4 files are supported');
      return;
    }
    setSelectedFile(file);
    setUploadProgress(0);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.subject.trim()) { toast.error('Subject is required'); return; }
    if (!form.batchId) { toast.error('Please select a batch'); return; }

    if (sourceType === 'url') {
      if (!form.videoUrl.trim()) { toast.error('Video URL is required'); return; }
    } else {
      if (!selectedFile) { toast.error('Please select an MP4 file to upload'); return; }
    }

    try {
      setIsUploading(true);
      const videoId = generateId();
      let finalVideoUrl = form.videoUrl;

      if (sourceType === 'file' && selectedFile) {
        // Read file as bytes
        const arrayBuffer = await selectedFile.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        // Create ExternalBlob with progress tracking
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
          setUploadProgress(pct);
        });

        // Upload file to backend and get reference ID
        const fileRefId = await uploadVideoFile.mutateAsync({ id: videoId, file: blob });
        // Store the file reference ID as the videoUrl with a special prefix
        finalVideoUrl = `mp4file:${fileRefId}`;
      }

      await uploadVideo.mutateAsync({
        id: videoId,
        ...form,
        videoUrl: finalVideoUrl,
      });

      toast.success('Video uploaded successfully!');
      setForm(defaultForm);
      setSelectedFile(null);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch {
      toast.error('Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  const isPending = isUploading || uploadVideo.isPending || uploadVideoFile.isPending;

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Upload className="h-4 w-4 text-primary" />
          Upload New Video
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="video-title">Title *</Label>
              <Input
                id="video-title"
                placeholder="e.g., Introduction to Algebra"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="video-subject">Subject *</Label>
              <Input
                id="video-subject"
                placeholder="e.g., Mathematics, Physics, Biology"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="video-desc">Description</Label>
            <Textarea
              id="video-desc"
              placeholder="Brief description of the video content..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
            />
          </div>

          {/* Video Source Toggle */}
          <div className="space-y-3">
            <Label>Video Source *</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setSourceType('url'); clearFile(); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  sourceType === 'url'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-border hover:bg-accent'
                }`}
              >
                <LinkIcon className="h-4 w-4" />
                URL / YouTube
              </button>
              <button
                type="button"
                onClick={() => { setSourceType('file'); setForm({ ...form, videoUrl: '' }); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  sourceType === 'file'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-border hover:bg-accent'
                }`}
              >
                <FileVideo className="h-4 w-4" />
                Upload MP4
              </button>
            </div>

            {sourceType === 'url' && (
              <div className="space-y-1.5">
                <Input
                  id="video-url"
                  type="url"
                  placeholder="https://example.com/video.mp4 or YouTube URL"
                  value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                />
              </div>
            )}

            {sourceType === 'file' && (
              <div className="space-y-2">
                {!selectedFile ? (
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileVideo className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">Click to select MP4 file</p>
                    <p className="text-xs text-muted-foreground mt-1">Only .mp4 files are supported</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".mp4,video/mp4"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                ) : (
                  <div className="border border-border rounded-lg p-3 bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileVideo className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm font-medium truncate">{selectedFile.name}</span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={clearFile}
                        className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors shrink-0"
                        disabled={isPending}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {isUploading && uploadProgress > 0 && (
                      <div className="space-y-1">
                        <Progress value={uploadProgress} className="h-1.5" />
                        <p className="text-xs text-muted-foreground text-right">{uploadProgress}% uploaded</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="thumb-url">Thumbnail URL</Label>
            <Input
              id="thumb-url"
              type="url"
              placeholder="https://example.com/thumbnail.jpg"
              value={form.thumbnailUrl}
              onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="video-category">Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v as Category })}
              >
                <SelectTrigger id="video-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="video-batch">Batch *</Label>
              <Select
                value={form.batchId}
                onValueChange={(v) => setForm({ ...form, batchId: v })}
              >
                <SelectTrigger id="video-batch">
                  <SelectValue placeholder="Select a batch" />
                </SelectTrigger>
                <SelectContent>
                  {batches.length === 0 ? (
                    <SelectItem value="__none__" disabled>
                      No batches available — create one first
                    </SelectItem>
                  ) : (
                    batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.name} ({CATEGORY_LABELS[batch.category]})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isUploading ? 'Uploading...' : 'Upload Video'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
