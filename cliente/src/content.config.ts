// client/src/content.config.ts
import { generateCollections } from '@sensinum/astro-strapi-loader';

let strapiCollections: any = {};

try {
  strapiCollections = await generateCollections(
    {
      url: import.meta.env.STRAPI_URL,
      token: import.meta.env.STRAPI_TOKEN, // Opcional si tu API es pública
    },
    [
      {
        name: "articulos", // Nombre de la colección en Astro
        query: {
          populate: {
            imagenPortada: { fields: ["url", "alternativeText"] },
            categorias: { fields: ["nombre", "slug", "color"] },
          },
        },
      },
      {
        name: "categorias",
        query: {
          fields: ["nombre", "slug", "descripcion", "color"],
        },
      },
    ]
  );
} catch (error) {
  console.error("Error cargando colecciones de Strapi:", error);
}

export const collections = strapiCollections;