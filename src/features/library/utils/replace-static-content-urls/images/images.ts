import { Capacitor } from '@capacitor/core';
import { FileStorageController, FILE_STORAGE_DEFAULT_DIRECTORY } from 'src/controllers';
import { pathUtils } from 'src/utils';

const imageRegexp = /<img.+?src=["']([^"']+)["'].*?>/gi;
const sgvImageRegexp = /<image.+?xlink:href=["']([^"']+)["'].*?>/gi;

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
    const svgImages = fileContent.match(sgvImageRegexp);
    const srcs: string[] = [];

    if (images) {
        for (const image of images) {
            srcs.push(image.replace(imageRegexp, '$1'));
        }
    }

    if (svgImages) {
        for (const image of svgImages) {
            srcs.push(image.replace(sgvImageRegexp, '$1'));
        }
    }

    if (!srcs.length) {
        return fileContent;
    }

    for (const src of srcs) {
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
