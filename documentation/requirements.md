# Requirements

## Authentication and Authorization

* There are three user roles: _admin_, _creator_, _watcher_.
* The _admin_ user should be unique in the system.
* To log in the system, must be provided __username__ and __password__.
* Only registered and logged users can access the system's contents.
* The user session has time limit of 7 days by default and it is configurable by the _admin_. After session expiration, the user must login again in the system.

## Data List Fetching

* All listing and search results must be paginated with default page size of 20, and maximum of 100.

## User Management

* A user must have unique username and email address.
* The _admin_ user is the only one who can create new users.
* To register a user, the following must be provided:
  * Full name.
  * Username.
  * Email address.
  * Password.
  * Role.
* The _admin_ can block access or reactivate users.
* Blocked users cannot access the platform.

## System Configuration

* During initial system setup, the _admin_ user must be configured.
* Only one _admin_ user can exist in the system.

## Video Uploading

* The _admin_ and _creators_ can add and remove videos to the platform.
* The information of a video is:
  * Title (required).
  * Description (required).
  * Thumbnail (optional).
* Allowed video file formats are __MP4__, __AVI__ and __WebM__.
* Allowed thumbnail file formats are __PNG__ and __JPEG__, with maximum size of _10 MB_.
* The maximum video file size is _25 GB_.
* Videos are not owned by a user.

## Video Watching and Searching

* By default, all users can watch all videos.
* Videos can be searched by a single query.
* There are no filters.
* All videos titles and descriptions are indexed in the platform.
