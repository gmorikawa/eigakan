import type { ID } from "@shared/types/id.js";
import type { NewVideo, Video } from "./entity.js";
import type { Repository } from "@shared/repository.js";

export interface VideoRepository extends Repository<ID, Video, NewVideo> { }