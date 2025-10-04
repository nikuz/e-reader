import { retrieveStyles } from './styles';
import { retrieveImages } from './images';

export async function webRetrieveStaticContent(props: {
    xmlDoc: Document,
}) {
    const { xmlDoc } = props;

    const staticMapping: Map<string, string> = new Map();

    await Promise.all([
        retrieveStyles({
            xmlDoc,
            staticMapping,
        }),
        retrieveImages({
            xmlDoc,
            staticMapping,
        }),
    ]);
}
