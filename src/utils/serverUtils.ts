/**
 * Get the server base URL for API calls
 */
export const getServerBaseUrl = (): string => {
  return import.meta.env.VITE_API_BASE_URL || '';
};

/**
 * Get the full avatar URL by appending server address if needed
 */
export const getAvatarUrl = (avatarPath: string | null | undefined): string | undefined => {
  if (!avatarPath) return undefined;
  
  // If it's already a full URL (starts with http/https), return as is
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath;
  }
  
  // If it's a relative path, prepend the server base URL
  const serverBaseUrl = getServerBaseUrl();
  if (serverBaseUrl) {
    return `${serverBaseUrl}${avatarPath.startsWith('/') ? '' : '/'}${avatarPath}`;
  }
  
  // Fallback to the original path if no server URL is configured
  return avatarPath;
};
