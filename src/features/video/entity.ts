import type { ID } from "@shared/types/id.js";
import type { Language } from "@features/language/entity.js";
import type { File } from "@features/file/entity.js";

export interface Video {
    id: ID;
    title: string;
    description: string | null;
    releasedAt: Date | null;
    language: Language | null;
    file: File;
    tags: Tags;
}

export type NewVideo = Omit<Video, "id">;
export type Tags = string[];
