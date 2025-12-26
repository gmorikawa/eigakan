import type { Request } from "@application/types/request.js";
import type { Response } from "@application/types/response.js";
import type { BusinessError } from "@shared/errors.js";

export function errorHandling(error: BusinessError, request: Request, response: Response, next: Function) {
    console.error("Error occurred:", error);

    if (error) {
        response.status(error.statusCode || 500);
        response.json({ message: error.message || "Internal Server Error" });
    }
}