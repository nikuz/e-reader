const imageRegex = /\.(jpg|jpeg|png|gif|bmp|svg|webp|ico)$/i;

export function isImage(filePath: string) {
    return imageRegex.test(filePath);
}

export function base64ToBlob(value: string, mime = 'image/jpeg'): Blob {
    const cleanValue = value.replace(/\s/g, '').replace(/^data:.*;base64,/, '');
    const binary = atob(cleanValue);
    const len = binary.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return new Blob([bytes], { type: mime });
}