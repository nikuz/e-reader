export function join(pathSegments: string[]) {
    // Filter out non-string and empty segments, then cast to string.
    const filteredSegments = pathSegments.filter(s => s.length > 0);

    const resolvedSegments: string[] = [];
    for (const segment of filteredSegments) {
        const parts = segment.split('/');
        for (const part of parts) {
            if (part === '..') {
                // Remove the last segment if possible
                if (resolvedSegments.length > 0 && resolvedSegments[resolvedSegments.length - 1] !== '..') {
                    resolvedSegments.pop();
                } else {
                    // If no segment to remove, keep '..' (e.g., for relative paths)
                    resolvedSegments.push('..');
                }
            } else if (part !== '.' && part.length > 0) {
                // Ignore '.' as it represents the current directory
                resolvedSegments.push(part);
            }
        }
    }

    const path = resolvedSegments.join('/');

    // Normalize the path: replace multiple consecutive slashes (except at the beginning for protocols like 'http://')
    // and remove the trailing slash, unless the path is just a single '/'.
    const normalizedPath = path.replace(/([^: /])\/+/g, '$1/').replace(/\/$/, '');

    // If the original path started with a slash, ensure the result does too,
    // unless it was an empty path (which is rare after the join/filter).
    if (pathSegments.length > 0 && pathSegments[0][0] === '/' && normalizedPath[0] !== '/') {
        return '/' + normalizedPath;
    }

    // Handle the edge case where the result is an empty string but the segments
    // contained a path that should resolve to a root, like if you pass only '/'.
    if (path === '/') {
        return '/';
    }

    return normalizedPath;
}