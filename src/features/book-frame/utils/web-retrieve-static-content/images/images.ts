import { FileStorageController, FILE_STORAGE_DEFAULT_DIRECTORY } from 'src/controllers';
import { converterUtils } from 'src/utils';

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

        const blobData = converterUtils.base64ToBlob(staticFileContent.data, `image/${extension}`);
        const blobUrl = URL.createObjectURL(blobData);

        image.setAttribute('src', blobUrl);

        staticMapping.set(src, blobUrl);
    }
}
