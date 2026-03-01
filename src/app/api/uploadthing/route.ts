// src/app/api/uploadthing/route.ts
import { createRouteHandler } from "uploadthing/next"; // ✅ Importación correcta desde @uploadthing/next
import { ourFileRouter } from "./core";

// Exporta las rutas GET y POST para el App Router de Next.js
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // config: { ... }, // Opcional: puedes añadir configuraciones globales aquí si lo necesitas
});
