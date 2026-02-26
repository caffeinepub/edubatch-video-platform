import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";

import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

// Use data migration on upgrade and persist in module-level data structures
(with migration = Migration.run)
actor {
  // Persistent blob storage and access control
  include MixinStorage();

  // Access control with role-based authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Category = {
    #class6;
    #class7;
    #class8;
    #class9;
    #class10;
    #class11;
    #class12;
    #neet;
  };

  type Video = {
    id : Text;
    title : Text;
    description : Text;
    videoUrl : Text;
    subject : Text;
    category : Category;
    batchId : Text;
    uploadedAt : Time.Time;
    thumbnailUrl : Text;
  };

  type Batch = {
    id : Text;
    name : Text;
    description : Text;
    category : Category;
    createdAt : Time.Time;
  };

  type UserProfile = {
    name : Text;
    email : Text;
  };

  module Video {
    public func compare(v1 : Video, v2 : Video) : Order.Order {
      switch (Text.compare(v1.title, v2.title)) {
        case (#equal) { Text.compare(v1.id, v2.id) };
        case (order) { order };
      };
    };
  };

  module Batch {
    public func compare(b1 : Batch, b2 : Batch) : Order.Order {
      Text.compare(b1.name, b2.name);
    };
  };

  let batches = Map.empty<Text, Batch>();
  let videos = Map.empty<Text, Video>();
  let videoFiles = Map.empty<Text, Storage.ExternalBlob>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Initialize: sets the caller as the first admin and seeds sample data
  public shared ({ caller }) func initialize(adminToken : Text, userProvidedToken : Text) : async () {
    AccessControl.initialize(accessControlState, caller, adminToken, userProvidedToken);
    createSampleBatch(
      "neet2025",
      "NEET 2025 Upcoming Batch",
      "A comprehensive NEET 2025 preparation program",
      #neet,
    );
    createSampleBatch(
      "neetfound",
      "NEET Foundation Batch",
      "Foundation batch for NEET aspirants",
      #neet,
    );
  };

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin) and caller != user) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Assign a role to a user (admin-only, enforced inside AccessControl.assignRole)
  public shared ({ caller }) func assignRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  func createSampleBatch(id : Text, name : Text, description : Text, category : Category) {
    let batch : Batch = {
      id;
      name;
      description;
      category;
      createdAt = Time.now();
    };
    batches.add(id, batch);

    let sampleVideos : [Video] = [
      {
        id = id # "phy1";
        title = "Physics Basics - Motion";
        description = "Introduction to Motion in Physics";
        videoUrl = "https://sample-videos.com/video1.mp4";
        subject = "Physics";
        category;
        batchId = id;
        uploadedAt = Time.now();
        thumbnailUrl = "https://sample-thumbnails.com/phy1.jpg";
      },
      {
        id = id # "chem1";
        title = "Chemistry - Atomic Structure";
        description = "Basics of Atomic Structure";
        videoUrl = "https://sample-videos.com/video2.mp4";
        subject = "Chemistry";
        category;
        batchId = id;
        uploadedAt = Time.now();
        thumbnailUrl = "https://sample-thumbnails.com/chem1.jpg";
      },
      {
        id = id # "bio1";
        title = "Biology - Cell Structure";
        description = "Introduction to Cell Structure";
        videoUrl = "https://sample-videos.com/video3.mp4";
        subject = "Biology";
        category;
        batchId = id;
        uploadedAt = Time.now();
        thumbnailUrl = "https://sample-thumbnails.com/bio1.jpg";
      },
    ];

    for (video in sampleVideos.values()) {
      videos.add(video.id, video);
    };
  };

  // Batch Operations (admin-only mutations)
  public shared ({ caller }) func createBatch(id : Text, name : Text, description : Text, category : Category) : async () {
    if (batches.containsKey(id)) {
      Runtime.trap("Batch already exists");
    };
    let batch : Batch = {
      id;
      name;
      description;
      category;
      createdAt = Time.now();
    };
    batches.add(id, batch);
  };

  public query ({ caller }) func getBatch(id : Text) : async Batch {
    switch (batches.get(id)) {
      case (null) { Runtime.trap("Batch does not exist") };
      case (?batch) { batch };
    };
  };

  public query ({ caller }) func getAllBatches() : async [Batch] {
    batches.values().toArray().sort();
  };

  public shared ({ caller }) func updateBatch(id : Text, name : Text, description : Text, category : Category) : async () {
    let batch = switch (batches.get(id)) {
      case (null) { Runtime.trap("Batch does not exist") };
      case (?batch) { batch };
    };
    let updatedBatch : Batch = {
      id;
      name;
      description;
      category;
      createdAt = batch.createdAt;
    };
    batches.add(id, updatedBatch);
  };

  public shared ({ caller }) func deleteBatch(id : Text) : async () {
    if (not batches.containsKey(id)) {
      Runtime.trap("Batch does not exist");
    };
    batches.remove(id);
  };

  // Video Operations (admin-only mutations)
  public shared ({ caller }) func uploadVideo(id : Text, title : Text, description : Text, videoUrl : Text, subject : Text, category : Category, batchId : Text, thumbnailUrl : Text) : async () {
    if (videos.containsKey(id)) {
      Runtime.trap("Video already exists");
    };
    let video : Video = {
      id;
      title;
      description;
      videoUrl;
      subject;
      category;
      batchId;
      uploadedAt = Time.now();
      thumbnailUrl;
    };
    videos.add(id, video);
  };

  public query ({ caller }) func getVideo(id : Text) : async Video {
    switch (videos.get(id)) {
      case (null) { Runtime.trap("Video does not exist") };
      case (?video) { video };
    };
  };

  public query ({ caller }) func getAllVideos() : async [Video] {
    videos.values().toArray().sort();
  };

  public query ({ caller }) func getVideosByCategory(category : Category) : async [Video] {
    videos.values().toArray().filter(
      func(video) { video.category == category }
    ).sort();
  };

  public query ({ caller }) func getVideosByBatchId(batchId : Text) : async [Video] {
    videos.values().toArray().filter(
      func(video) { video.batchId == batchId }
    ).sort();
  };

  public shared ({ caller }) func deleteVideo(id : Text) : async () {
    if (not videos.containsKey(id)) {
      Runtime.trap("Video does not exist");
    };
    videos.remove(id);
  };

  public shared ({ caller }) func updateVideo(id : Text, title : Text, description : Text, videoUrl : Text, subject : Text, category : Category, batchId : Text, thumbnailUrl : Text) : async () {
    let video = switch (videos.get(id)) {
      case (null) { Runtime.trap("Video does not exist") };
      case (?video) { video };
    };
    let updatedVideo : Video = {
      id;
      title;
      description;
      videoUrl;
      subject;
      category;
      batchId;
      uploadedAt = video.uploadedAt;
      thumbnailUrl;
    };
    videos.add(id, updatedVideo);
  };

  // Store video file reference (admin-only)
  public shared ({ caller }) func uploadVideoFile(id : Text, file : Storage.ExternalBlob) : async Text {
    videoFiles.add(id, file);
    id;
  };

  // Get stored file reference (public read)
  public query ({ caller }) func getFile(id : Text) : async ?Storage.ExternalBlob {
    videoFiles.get(id);
  };

  public query ({ caller }) func getFiles() : async [(Text, Storage.ExternalBlob)] {
    videoFiles.toArray();
  };
};
