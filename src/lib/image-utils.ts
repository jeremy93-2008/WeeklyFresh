export function getImageUrl(image: string | null | undefined): string {
  if (!image) return "/placeholder-recipe.jpg";
  if (image.startsWith("http")) return image;
  return `/recipe-images/${image}`;
}

export function extractFilename(url: string): string {
  return url.split("/").pop()?.split("?")[0] ?? "";
}
