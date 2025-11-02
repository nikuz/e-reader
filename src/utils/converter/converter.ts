export function removeBase64Prefix(value: string): string {
    return value.replace(/^data:.*;base64,/, '').trim();
}

export function base64ToBlob(value: string, mime = 'image/jpeg'): Blob {
    const cleanValue = removeBase64Prefix(value);
    const binary = atob(cleanValue);
    const len = binary.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return new Blob([bytes], { type: mime });
}

export function base64ToArrayBuffer(b64: string) {
    const bin = atob(b64);
    const len = bin.length;
    const buf = new ArrayBuffer(len);
    const bytes = new Uint8Array(buf);

    for (let i = 0; i < len; i++) {
        bytes[i] = bin.charCodeAt(i);
    };

    return buf;
}