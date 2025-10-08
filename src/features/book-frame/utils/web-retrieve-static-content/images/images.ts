import { FileStorageController, FILE_STORAGE_DEFAULT_DIRECTORY } from 'src/controllers';

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
        const src = image.getAttribute('src')?.replace(`/${FILE_STORAGE_DEFAULT_DIRECTORY}`, '');
        if (!src) {
            continue;
        }

        const cachedBlobUrl = staticMapping.get(src);

        if (cachedBlobUrl) {
            image.setAttribute('src', cachedBlobUrl);
            continue;
        }

        const staticFileContent = await FileStorageController.readFile({ path: src });

        const extension = src.replace(/.+\.([^.]+)$/, '$1');

        const url = `data:image/${extension};base64,${staticFileContent.data}`;
        const data = await (await fetch(url)).blob();

        const blobUrl = URL.createObjectURL(data);

        image.setAttribute('src', blobUrl);

        staticMapping.set(src, blobUrl);
    }
}
