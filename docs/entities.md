# Entities

## Classes

### User

* _id_: __primary key, UUID, not null__;
* _username_: __unique, not null, varchar(63)__;
* _password_: __crypt, not null, varchar(255)__;
* _email_: __unique, not null, varchar(127)__;
* _role_: __UserRole, not null__;
* _status_: __UserStatus, not null__;
* _fullname_: __varchar(127)__;

### User Configuration

* _user_: __User, foreign key, UUID, not null__
* _first\_access_: __not null, boolean__

### FileType

* _id_: __primary key, UUID, not null__;
* _name_: __not null, varchar(127)__;
* _extension_: __unique, not null, varchar(15)__;
* _mime\_type_: __not null, varchar(127)__;

### File

* _id_: __primary key, UUID, not null__;
* _path_: __not null, varchar(1023)__;
* _filename_: __not null, varchar(255)__;
* _type_: __FileType, not null__;
* _state_: __FileState, not null__;

### Language

* _id_: __primary key, UUID, not null__;
* _name_: __varchar(127), not null__;
* _iso\_code_: __varchar(7), not null, unique__;

### Video

* _id_: __primary key, UUID, not null__;
* _title_: __varchar(127), not null__;
* _description_: __varchar(1023)__;
* _released\_at_: __date__;
* _language_: __Language__;
* _file_: __File, not null__;
* _tags_:  __varchar(255)__;

### Genre

* _id_: __primary key, UUID, not null__;
* _name_: __varchar(127)__;

### Person

* _id_: __primary key, UUID, not null__;
* _fullname_: __varchar(127), not null__;
* _profiles_: __PersonProfile, list, not null__;

### Movie

* _id_: __Video, UUID, not null__;
* _genre_: __Genre, not null__;
* _directors_: __Person, list__;
* _actors_: __Person, list__;

### Series

* _id_: __primary key, UUID, not null__;
* _title_: __varchar(127), not null__;
* _description_: __varchar(127)__;
* _released\_at_: __date__;
* _language_: __Language__;
* _tags_:  __varchar(255)__;

### Season

* _id_: __primary key, UUID, not null__;
* _title_: __varchar(127), not null__;
* _released\_at_: __date__;
* _description_: __varchar(127)__;
* _series_: __Series, not null__;

### Episode

* _video\_id_: __Video, not null__;
* _season\_id_: __Season, not null__;

## Enums

### UserStatus

* _ACTIVE_
* _BLOCKED_

### PersonProfile

* _DIRECTOR_
* _ACTOR_

### UserRole

* _ADMIN_
* _EDITOR_
* _VIEWER_

### FileState

* _UPLOADING_
* _AVAILABLE_
* _CORRUPTED_
