/**
 * Converts common file sharing links to direct image URLs usable in <img src />
 * Currently supports: Google Drive
 */
export const processImageUrl = (url: string): string => {
  if (!url) return '';

  // Google Drive: Convert /file/d/{id}/view to /uc?export=view&id={id}
  const googleDriveRegex = /\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(googleDriveRegex);

  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }

  return url;
};
