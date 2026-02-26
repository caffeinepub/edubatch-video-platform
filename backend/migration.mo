import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
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
    uploadedAt : Int;
    thumbnailUrl : Text;
  };

  type Batch = {
    id : Text;
    name : Text;
    description : Text;
    category : Category;
    createdAt : Int;
  };

  type UserProfile = {
    name : Text;
    email : Text;
  };

  // Old actor state shape
  type OldActor = {
    batches : Map.Map<Text, Batch>;
    videos : Map.Map<Text, Video>;
  };

  // New actor state shape
  type NewActor = {
    batches : Map.Map<Text, Batch>;
    videos : Map.Map<Text, Video>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    {
      batches = old.batches;
      videos = old.videos;
      userProfiles = Map.empty<Principal, UserProfile>();
    };
  };
};
