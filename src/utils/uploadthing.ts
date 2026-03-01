// src/utils/uploadthing.ts
import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";
// Importa el tipo de tu FileRouter desde el archivo core.ts
import type { OurFileRouter } from "@/src/app/api/uploadthing/core"; // ✅ Asegúrate que la ruta sea correcta

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

// Si también quieres usar el hook useUploadThing, puedes añadirlo:
// import { generateReactHelpers } from "@uploadthing/react/hooks";
// export const { useUploadThing } = generateReactHelpers<OurFileRouter>();
