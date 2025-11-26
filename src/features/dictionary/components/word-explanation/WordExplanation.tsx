import { useMemo, Fragment } from 'react';
import { Typography } from 'src/design-system/components';
import { useSettingsStateSelect } from 'src/features/settings/state';
import { parseSimplifiedMarkdown } from '../../utils';

interface Props {
    text: string;
}

export default function WordExplanation({ text }: Props) {
    const dictionarySettings = useSettingsStateSelect('dictionary');

    const lines = useMemo(() => {
        const textLines = text.split('\n');

        if (!dictionarySettings.showTranslation) {
            return [textLines[0]];
        }

        return textLines;
    }, [text, dictionarySettings]);

    return lines.map((line, lineIndex) => {
        if (!line.trim()) {
            return null;
        }

        const segments = parseSimplifiedMarkdown(line);

        return (
            <Typography
                key={lineIndex}
                component="p"
                sx={{
                    mb: lineIndex < lines.length - 1 ? 1 : 0
                }}
            >
                {segments.map((segment, segmentIndex) => (
                    <Fragment key={segmentIndex}>
                        <Typography
                            component="span"
                            fontWeight={segment.bold ? 'bold' : 'regular'}
                        >
                            {segment.text}
                        </Typography>
                    </Fragment>
                ))}
            </Typography>
        );
    });
}
