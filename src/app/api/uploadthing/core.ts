// src/app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from 'uploadthing/next';
// No necesitamos UploadThingError si no vamos a lanzar errores de autenticación
// import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// No incluimos la función 'auth' ni el 'middleware' por ahora

export const ourFileRouter = {
  // Define tu FileRoute para subir imágenes de hoteles
  hotelImageUploader: f({
    image: {
      maxFileSize: '4MB', // Tamaño máximo por imagen
      maxFileCount: 10, // Hasta 10 imágenes por subida
    },
  })
    // Eliminamos el .middleware() ya que no queremos autenticación/validación en el servidor por ahora
    .onUploadComplete(async ({ metadata, file }) => {
      // Este código se ejecuta en tu SERVIDOR Next.js después de que la subida a Uploadthing ha terminado.
      console.log('Subida de imagen de hotel completada:', file);
      console.log('URL del archivo (ufsUrl):', file.ufsUrl);

      // Lo que sea que se retorne aquí es enviado al callback `onClientUploadComplete` del cliente
      // Aseguramos que fileUrl esté presente como fallback
      return { fileUrl: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
