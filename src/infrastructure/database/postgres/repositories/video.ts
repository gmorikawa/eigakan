import type { ID } from "@shared/types/id.js";

import type { File } from "@features/file/entity.js";
import type { NewVideo, Video } from "@features/video/entity.js";
import type { VideoRepository } from "@features/video/repository.js";

import type { DatabaseClient } from "@infrastructure/database/client.js";
import { SQL } from "@infrastructure/database/utils.js";

export class PostgresVideoRepository implements VideoRepository {
    constructor(
        private readonly client: DatabaseClient
    ) { }

    public async findAll(): Promise<Video[]> {
        const query = SQL(
            "SELECT",
                "v.*,",
                "f.id as f_id,",
                "f.filename as f_filename,",
                "f.path as f_path,",
                "f.state as f_state,",
                "ft.id as ft_id,",
                "ft.name as ft_name,",
                "ft.extension as ft_extension,",
                "ft.mime_type as ft_mime_type,",
                "l.id as l_id,",
                "l.name as l_name,",
                "l.code as l_code",
            "FROM application.videos v",
            "LEFT JOIN application.files f ON v.file_id = f.id",
            "LEFT JOIN application.file_types ft ON f.type_id = ft.id",
            "LEFT JOIN application.languages l ON v.language_id = l.id;"
        );

        return this.client.query(query)
            .then((values: any[]) => {
                return values.map((value) => this.mapToEntityWithJoin(value));
            });
    }

    public async findById(id: ID): Promise<Video | null> {
        const query = SQL(
            "SELECT",
                "v.*,",
                "f.id as f_id,",
                "f.filename as f_filename,",
                "f.path as f_path,",
                "f.state as f_state,",
                "ft.id as ft_id,",
                "ft.name as ft_name,",
                "ft.extension as ft_extension,",
                "ft.mime_type as ft_mime_type,",
                "l.id as l_id,",
                "l.name as l_name,",
                "l.code as l_code",
            "FROM application.videos v",
            "LEFT JOIN application.files f ON v.file_id = f.id",
            "LEFT JOIN application.file_types ft ON f.type_id = ft.id",
            "LEFT JOIN application.languages l ON v.language_id = l.id",
            "WHERE v.id = $1;"
        );
        const params = [id];

        return this.client.query(query, params)
            .then((values: any[]) => {
                const video = values?.shift();
                return video ? this.mapToEntityWithJoin(video) : null;
            });
    }

    public async create(video: NewVideo): Promise<Video> {
        const query = SQL(
            "INSERT INTO application.videos (",
                "title,",
                "description,",
                "released_at,",
                "language_id,",
                "file_id,",
                "tags",
            ") VALUES (",
                "$1, $2, $3, $4, $5, $6",
            ") RETURNING *;"
        );
        const params = [
            video.title,
            video.description ?? null,
            video.releasedAt ?? null,
            video.language?.id ?? null,
            video.file?.id ?? null,
            video.tags?.join(", ") ?? null
        ];


        return this.client.query(query, params)
            .then((values: any[]) => {
                const createdVideo = values?.shift();
                if (!createdVideo) {
                    throw new Error("Failed to create video");
                }
                return this.mapToEntity(createdVideo);
            });
    }

    public async update(id: ID, video: Video): Promise<Video | null> {
        const query = SQL(
            "UPDATE application.videos SET",
                "title = $1,",
                "description = $2,",
                "released_at = $3,",
                "language_id = $4,",
                "file_id = $5,",
                "tags = $6",
            "WHERE id = $7",
            "RETURNING *;"
        );
        const params = [
            video.title,
            video.description ?? null,
            video.releasedAt ?? null,
            video.language?.id ?? null,
            video.file?.id ?? null,
            video.tags?.join(", ") ?? null,
            id
        ];

        return this.client.query(query, params)
            .then((values: any[]) => {
                const updatedVideo = values?.shift();
                if (!updatedVideo) {
                    throw new Error("Failed to update video");
                }
                return this.mapToEntity(updatedVideo);
            });
    }

    public async delete(id: ID): Promise<boolean> {
        const query = SQL(
            "DELETE FROM application.videos",
            "WHERE id = $1;"
        );
        const params = [id];

        return this.client.query(query, params)
            .then(() => true)
            .catch(() => false);
    }

    private async populateFile(fileId: ID) {
        const query = SQL(
            "SELECT",
                "f.*,",
                "ft.id as ft_id,",
                "ft.name as ft_name,",
                "ft.extension as ft_extension,",
                "ft.mime_type as ft_mime_type",
            "FROM application.files f",
            "JOIN application.file_types ft ON f.type_id = ft.id",
            "WHERE f.id = $1;"
        );
        const params = [fileId];

        return this.client.query(query, params)
            .then((values: any[]) => {
                const fileType = values?.shift();
                return fileType && {
                    id: fileType["id"],
                    filename: fileType["filename"],
                    path: fileType["path"],
                    state: fileType["state"],
                    type: {
                        id: fileType["ft_id"],
                        name: fileType["ft_name"],
                        mimeType: fileType["ft_mime_type"],
                        extension: fileType["ft_extension"]
                    }
                } as File;
            });
    }

    private async populateLanguage(languageId: ID) {
        const query = "SELECT * FROM application.languages WHERE id = $1;";
        const params = [languageId];

        return this.client.query(query, params)
            .then((values: any[]) => {
                const language = values?.shift();
                return language && {
                    id: language["id"],
                    name: language["name"],
                    code: language["code"]
                };
            });
    }

    private async mapToEntity(value: any): Promise<Video> {
        return {
            id: value["id"],
            title: value["title"],
            description: value["description"],
            releasedAt: value["released_at"],
            file: await this.populateFile(value["file_id"]),
            language: await this.populateLanguage(value["language_id"]),
            tags: value["tags"].split(", ").filter((tag: string) => tag !== "")
        };
    }

    private mapToEntityWithJoin(value: any): Video {
        return {
            id: value["id"],
            title: value["title"],
            description: value["description"],
            releasedAt: value["released_at"],
            file: value["f_id"] && {
                id: value["f_id"],
                filename: value["f_filename"],
                path: value["f_path"],
                state: value["f_state"],
                type: {
                    id: value["ft_id"],
                    name: value["ft_name"],
                    mimeType: value["ft_mime_type"],
                    extension: value["ft_extension"]
                }
            },
            language: value["l_id"] && {
                id: value["l_id"],
                name: value["l_name"],
                code: value["l_code"]
            },
            tags: value["tags"].split(", ").filter((tag: string) => tag !== "")
        };
    }
}