export async function readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            resolve(event.target?.result as ArrayBuffer);
        };

        reader.onerror = (event) => {
            reject(event.target?.error);
        };

        reader.readAsArrayBuffer(file);
    });
}

export async function readAsDataURL(file: File): Promise<Base64URLString> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            resolve(event.target?.result as Base64URLString);
        };

        reader.onerror = (event) => {
            reject(event.target?.error);
        };

        reader.readAsDataURL(file);
    });
}