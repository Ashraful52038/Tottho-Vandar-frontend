// utils/imageUtils.ts
export const getFullImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  const fullUrl = `${baseUrl}${cleanPath}`;

  return fullUrl;
};