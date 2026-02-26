# Specification

## Summary
**Goal:** Add MP4 video upload support restricted to admin users only, with an admin role system backed by the authenticated principal.

**Planned changes:**
- Add an admin role system to the backend storing admin principal IDs, with the deployer pre-registered as the initial admin and an `isAdmin(principal)` query exposed
- Add an `uploadVideoFile` backend endpoint that accepts chunked MP4 binary data and returns a reference URL/ID
- Add an MP4 file input to the video upload form, visible only to admin users, that uploads the file to the backend and stores the returned reference
- Gate the admin dashboard and navigation button behind the `isAdmin` check; redirect non-admins away from `/admin` with an access-denied message
- Update the video player page to render uploaded MP4 files using a native HTML5 `<video>` element, while keeping YouTube videos in the existing iframe embed

**User-visible outcome:** Admin users can upload MP4 video files directly through the admin dashboard and watch them via a native video player, while non-admin users cannot access the upload functionality or admin area.
