import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Video {
    id: string;
    title: string;
    thumbnailUrl: string;
    subject: string;
    description: string;
    category: Category;
    batchId: string;
    videoUrl: string;
    uploadedAt: Time;
}
export type Time = bigint;
export interface Batch {
    id: string;
    name: string;
    createdAt: Time;
    description: string;
    category: Category;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum Category {
    class6 = "class6",
    class7 = "class7",
    class8 = "class8",
    class9 = "class9",
    neet = "neet",
    class10 = "class10",
    class11 = "class11",
    class12 = "class12"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignRole(user: Principal, role: UserRole): Promise<void>;
    createBatch(id: string, name: string, description: string, category: Category): Promise<void>;
    deleteBatch(id: string): Promise<void>;
    deleteVideo(id: string): Promise<void>;
    getAllBatches(): Promise<Array<Batch>>;
    getAllVideos(): Promise<Array<Video>>;
    getBatch(id: string): Promise<Batch>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFile(id: string): Promise<ExternalBlob | null>;
    getFiles(): Promise<Array<[string, ExternalBlob]>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVideo(id: string): Promise<Video>;
    getVideosByBatchId(batchId: string): Promise<Array<Video>>;
    getVideosByCategory(category: Category): Promise<Array<Video>>;
    initialize(adminToken: string, userProvidedToken: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBatch(id: string, name: string, description: string, category: Category): Promise<void>;
    updateVideo(id: string, title: string, description: string, videoUrl: string, subject: string, category: Category, batchId: string, thumbnailUrl: string): Promise<void>;
    uploadVideo(id: string, title: string, description: string, videoUrl: string, subject: string, category: Category, batchId: string, thumbnailUrl: string): Promise<void>;
    uploadVideoFile(id: string, file: ExternalBlob): Promise<string>;
}
