import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Category, type Batch, type Video, ExternalBlob } from '../backend';

// ─── Initialize ───────────────────────────────────────────────────────────────

export function useInitialize() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params?: { adminToken?: string; userProvidedToken?: string }) => {
      if (!actor) throw new Error('No actor');
      return actor.initialize(params?.adminToken ?? '', params?.userProvidedToken ?? '');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Batch Queries ───────────────────────────────────────────────────────────

export function useGetAllBatches() {
  const { actor, isFetching } = useActor();
  return useQuery<Batch[]>({
    queryKey: ['batches'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBatches();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBatch(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Batch>({
    queryKey: ['batch', id],
    queryFn: async () => {
      if (!actor) throw new Error('No actor');
      return actor.getBatch(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateBatch() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string; name: string; description: string; category: Category }) => {
      if (!actor) throw new Error('No actor');
      return actor.createBatch(params.id, params.name, params.description, params.category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
}

export function useUpdateBatch() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string; name: string; description: string; category: Category }) => {
      if (!actor) throw new Error('No actor');
      return actor.updateBatch(params.id, params.name, params.description, params.category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
}

export function useDeleteBatch() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('No actor');
      return actor.deleteBatch(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}

// ─── Video Queries ────────────────────────────────────────────────────────────

export function useGetAllVideos() {
  const { actor, isFetching } = useActor();
  return useQuery<Video[]>({
    queryKey: ['videos'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVideos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetVideo(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Video>({
    queryKey: ['video', id],
    queryFn: async () => {
      if (!actor) throw new Error('No actor');
      return actor.getVideo(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetVideosByCategory(category: Category) {
  const { actor, isFetching } = useActor();
  return useQuery<Video[]>({
    queryKey: ['videos', 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVideosByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetVideosByBatchId(batchId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Video[]>({
    queryKey: ['videos', 'batch', batchId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVideosByBatchId(batchId);
    },
    enabled: !!actor && !isFetching && !!batchId,
  });
}

export function useUploadVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      title: string;
      description: string;
      videoUrl: string;
      subject: string;
      category: Category;
      batchId: string;
      thumbnailUrl: string;
    }) => {
      if (!actor) throw new Error('No actor');
      return actor.uploadVideo(
        params.id,
        params.title,
        params.description,
        params.videoUrl,
        params.subject,
        params.category,
        params.batchId,
        params.thumbnailUrl
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}

export function useDeleteVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('No actor');
      return actor.deleteVideo(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}

export function useUpdateVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      title: string;
      description: string;
      videoUrl: string;
      subject: string;
      category: Category;
      batchId: string;
      thumbnailUrl: string;
    }) => {
      if (!actor) throw new Error('No actor');
      return actor.updateVideo(
        params.id,
        params.title,
        params.description,
        params.videoUrl,
        params.subject,
        params.category,
        params.batchId,
        params.thumbnailUrl
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}

// ─── File / Blob Queries ──────────────────────────────────────────────────────

export function useUploadVideoFile() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (params: { id: string; file: ExternalBlob }) => {
      if (!actor) throw new Error('No actor');
      return actor.uploadVideoFile(params.id, params.file);
    },
  });
}

export function useGetFile(fileId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<ExternalBlob | null>({
    queryKey: ['file', fileId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getFile(fileId);
    },
    enabled: !!actor && !isFetching && !!fileId,
  });
}

export { Category };
