import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { pathUtils } from 'src/utils';

export async function replaceImageUrls(props: {
    xmlDoc: Document,
    chapterDirname: string,
    staticMapping: Map<string, string>,
}) {
    const {
        xmlDoc,
        chapterDirname,
        staticMapping,
    } = props;

    const images = xmlDoc.querySelectorAll('img');

    for (const image of images) {
        const src = image.getAttribute('src');
        if (!src) {
            continue;
        }

        
        const cachedImageUrl = staticMapping.get(src);
        if (cachedImageUrl) {
            image.setAttribute('src', cachedImageUrl);
            continue;
        }
        
        const staticSrc = pathUtils.join([chapterDirname, src]);
        const fileUri = await Filesystem.getUri({
            path: staticSrc,
            directory: Directory.Documents,
        });
        const imageFileUri = Capacitor.convertFileSrc(fileUri.uri);
        
        staticMapping.set(src, imageFileUri);
        image.setAttribute('src', imageFileUri);
    }
}