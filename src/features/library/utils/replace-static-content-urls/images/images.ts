import { Capacitor } from '@capacitor/core';
import { FileStorageController, FILE_STORAGE_DEFAULT_DIRECTORY } from 'src/controllers';
import { pathUtils } from 'src/utils';

const imageRegexp = /<img.+?src=["']([^"']+)["'].*?>/gi;

export async function replaceImageUrls(props: {
    fileContent: string,
    chapterDirname: string,
    staticMapping: Map<string, string>,
}): Promise<string> {
    const {
        fileContent,
        chapterDirname,
        staticMapping,
    } = props;

    let modifiedFileContent = fileContent;
    const images = fileContent.match(imageRegexp);

    if (!images) {
        return fileContent;
    }

    for (const image of images) {
        const src = image.replace(imageRegexp, '$1');
        if (!src || src.startsWith(`/${FILE_STORAGE_DEFAULT_DIRECTORY}`)) {
            continue;
        }

        const cachedImageUrl = staticMapping.get(src);
        if (cachedImageUrl) {
            modifiedFileContent = modifiedFileContent.replace(src, cachedImageUrl);
            continue;
        }
        
        const staticSrc = pathUtils.join([chapterDirname, src]);
        const fileUri = await FileStorageController.getUri({
            path: staticSrc,
        });
        const imageFileUri = Capacitor.convertFileSrc(fileUri.uri);
        
        staticMapping.set(src, imageFileUri);
        modifiedFileContent = modifiedFileContent.replace(src, imageFileUri);
    }

    return modifiedFileContent;
}
