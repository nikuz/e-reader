import { Filesystem, Directory } from '@capacitor/filesystem';

export async function retrieveImages(props: {
    xmlDoc: Document,
    staticMapping: Map<string, string>,
}) {
    const {
        xmlDoc,
        staticMapping,
    } = props;

    const images = xmlDoc.querySelectorAll('img');

    for (const image of images) {
        const src = image.getAttribute('src')?.replace(Directory.Documents, '');
        if (!src) {
            continue;
        }

        const cachedBlobUrl = staticMapping.get(src);

        if (cachedBlobUrl) {
            image.setAttribute('src', cachedBlobUrl);
            continue;
        }

        const fileReadResponse = await Filesystem.readFile({
            path: src,
            directory: Directory.Documents,
        });

        let staticFileContent = fileReadResponse.data;
        if (staticFileContent instanceof Blob) {
            staticFileContent = await staticFileContent.text();
        }

        const url = `data:image/jpeg;base64,${staticFileContent}`;
        const data = await (await fetch(url)).blob();

        const blobUrl = URL.createObjectURL(data);

        image.setAttribute('src', blobUrl);

        staticMapping.set(src, blobUrl);
    }
}