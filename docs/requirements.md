# Requirements

## Autorization and Authentication

1. There are three roles for users in the system: the _admin_, the _creator_, and the _viewer_.
2. The _admin_ has full permissions while the _viewer_ can only access content without doing modifications. The _creator_ can do some modifications in data.
3. All users must have:
    1. A __unique username__.
    2. A __secret password__.
    3. A __unique e-mail address__ for notification ans password recovery.
4. Only authenticated users may access system resources. Unauthenticated access is not permitted.
5. Authentication is based on an access token issued upon successful login.
6. The token have a configurable lifetime in which the _admin_ user can modify it. The default value is 7 days to expire.
7. If a token is expired the user will issue a new valid access token with a refresh token.
8. If a user is blocked, any active access or refresh tokens must be revoked immediately.

## User Registration and Account Management

1. The _admin_ user:
    1. Is the first account in the system.
    2. Must always exist.
    3. Cannot be deleted.
    4. Must be unique in the system.
2. Only _admin_ can create new user accounts. Users cannot self-register.
3. When creating a user, the _admin_ must assign a temporary password. Upon first login, the user is required to set a new permanent password.
4. _Admin_ can block or reactivate user accounts.
5. Blocking a user prevents system access but does not remove their data.

## Role Permissions

1. __Admin__:
    1. Full access to all system features, configuration, and data.
    2. Cannot be deleted.
2. __Creator__:
    1. Can create and modify videos information, upload files.
    2. Cannot modify administrative configuration settings.
3. __Viewer__:
    1. Can view all videos files.
    2. Can only modify their own user-related data (profile, personal lists).
4. Role hierarchy is cumulative:
    _admin_ > _creator_ > _viewer_ (each role inherits the permissions of the lower role).

## File Storage

1. The storage is a separated service which provides a interface for the available actions.
2. The maximum upload size by default is 50mb per file. It is configurable by _admin_.
3. The client must provide a hash (e.g., SHA-256) of the uploaded file so the server can verify integrity.
4. _Admin_ and _creators_ may upload and download files; _viewer_ can only visualize or download them.
5. The storage system does not enforce directory structures; files are identified by generated keys.

## Video Management

1. The system should handle different kinds of media: youtube videos, movies, series, animes, etc.
2. __Videos__ and __Playlists__ can be added by _admins_ and _creators_, and are visible to all users.
4. To register a video, the following information may be given:
    1. Title (required)
    2. Description
    3. Release Date
    4. Language
    5. Video File
    6. Tags
5. For each video registered there should be one file.
6. Videos can be grouped together in a specific order creating a playlist.

## Movies Management

1. A movie is a kind of video.
2. To register a movie, beyond the video information, it may have:
    1. Genre (required)
    2. Directors
    3. Actors
3. A movie can have a prequel, a sequel, a alternative edition; that are all related to it.

## Series Management

1. Series are a group of videos that are divided in seasons and episodes.
2. To register a series the following information may be given:
    1. Title (required)
    2. Description
    3. Release Date
    4. Language
    5. Genre
    6. Directors
    7. Actors
3. For each series there should be one or more seasons.
4. A series' season consist of:
    1. Title (required)
    2. Release Date
    3. Description
5. Each season groups a sequence of videos that are episodes of the series.
