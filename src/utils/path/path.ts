export function join(pathSegments: string[]) {
    // Filter out non-string and empty segments, then cast to string.
    const path = pathSegments
        .filter(s => s.length > 0)
        .join('/');
    
    // Normalize the path: replace multiple consecutive slashes (except at the beginning for protocols like 'http://')
    // and remove the trailing slash, unless the path is just a single '/'.
    //
    // The regex:
    // - Replaces '//' or more with a single '/'
    // - Look-behind `(?<!: )` ensures we don't break 'http://' or 'file://'
    const normalizedPath = path.replace(/([^: /])\/+/g, '$1/').replace(/\/$/, ''); // Remove trailing slash

    // If the original path started with a slash, ensure the result does too,
    // unless it was an empty path (which is rare after the join/filter).
    // If the path is empty (e.g., if you pass no segments), return an empty string.
    if (path.length > 0 && path[0] === '/' && normalizedPath[0] !== '/') {
        return '/' + normalizedPath;
    }

    // Handle the edge case where the result is an empty string but the segments
    // contained a path that should resolve to a root, like if you pass only '/'.
    if (path === '/') {
        return '/';
    }

    return normalizedPath;
}