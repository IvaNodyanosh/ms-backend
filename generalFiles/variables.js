import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const userAvatarDefault = "http://localhost:3100/api/avatars/avatar.jpg";

export const maxSize = 25 * 1024 * 1024;

export const allowEmail = ["com", "net", "eu", "sk", "cz", "de"];
export const phoneRegex =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

export const fileTypeChecking = (typeFile) => {
  return (
    typeFile !== "jpeg" &&
    typeFile !== "png" &&
    typeFile !== "svg" &&
    typeFile !== "pdf" &&
    typeFile !== "txt" &&
    typeFile !== "pptx" &&
    typeFile !== "ppt" &&
    typeFile !== "mp4" &&
    typeFile !== "mp3" &&
    typeFile !== "mp4a" &&
    typeFile !== "wav" &&
    typeFile !== "wma" &&
    typeFile !== "wmv" &&
    typeFile !== "MOV" &&
    typeFile !== "m4v"
  );
};
