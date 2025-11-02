const imageRegex = /\.(jpg|jpeg|png|gif|bmp|svg|webp|ico)$/i;

export function isImage(filePath: string) {
    return imageRegex.test(filePath);
}
