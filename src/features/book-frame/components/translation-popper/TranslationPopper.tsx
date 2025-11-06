import { useState, useMemo } from 'react';
import {
    Popper,
    Paper,
    Box,
    CircularProgress,
} from 'src/design-system/components';
import { styled } from 'src/design-system/styles';
import type { VirtualElement } from 'src/design-system/types';
import { useDictionaryStateSelect } from 'src/features/dictionary/state';
import {
    useBookFrameStateSelect,
    useBookFrameStateMatch,
} from '../../state';
import TranslationPopperTranslation from './TranslationPopperTranslation';
import TranslationPopperExplanation from './TranslationPopperExplanation';
import TranslationPopperPronunciation from './TranslationPopperPronunciation';

const POPPER_OFFSET = 8;
const POPPER_BG_COLOR = '#262626';

export function TranslationPopper() {
    const [arrowEl, setArrowEl] = useState<HTMLSpanElement | null>(null);
    const iframeEl = useBookFrameStateSelect('iframeEl');
    const selectedHighlight = useBookFrameStateSelect('selectedHighlight');
    const isAnalyzingWord = useBookFrameStateMatch(['ANALYZING_WORD']);
    const translatingWord = useDictionaryStateSelect('translatingWord');

    const virtualElement = useMemo<VirtualElement | null>(() => {
        if (!selectedHighlight?.range || !iframeEl) {
            return null;
        }

        const range = selectedHighlight.range;

        const getBoundingClientRect = () => {
            if (!iframeEl) {
                return new DOMRect();
            }

            const rangeRect = range.getBoundingClientRect();
            const iframeRect = iframeEl.getBoundingClientRect();

            return new DOMRect(
                rangeRect.left + iframeRect.left,
                rangeRect.top + iframeRect.top,
                rangeRect.width,
                rangeRect.height,
            );
        };

        return {
            getBoundingClientRect,
        };
    }, [iframeEl, selectedHighlight]);

    if (!isAnalyzingWord || !selectedHighlight || !virtualElement) {
        return null;
    }

    return (
        <StyledPopper
            open={true}
            placement="bottom"
            anchorEl={virtualElement}
            modifiers={[
                {
                    name: 'offset',
                    options: {
                        offset: [0, POPPER_OFFSET],
                    },
                },
                {
                    name: 'flip',
                    options: {
                        fallbackPlacements: ['top'],
                    },
                },
                {
                    name: 'preventOverflow',
                    options: {
                        altBoundary: true,
                        padding: 8,
                    },
                },
                {
                    name: 'arrow',
                    enabled: true,
                    options: {
                        element: arrowEl,
                    },
                },
            ]}
        >
            <Paper
                elevation={0}
                style={{
                    position: 'relative',
                    padding: 8,
                    backgroundColor: POPPER_BG_COLOR,
                }}
            >
                <Box
                    ref={setArrowEl}
                    component="span"
                    className="arrow"
                    sx={{
                        position: 'absolute',
                        fontSize: 7,
                        width: '3em',
                        height: '3em',
                        '&::before': {
                            content: '""',
                            margin: 'auto',
                            display: 'block',
                            width: 0,
                            height: 0,
                            borderStyle: 'solid',
                        },
                    }}
                />
                <TranslationPopperTranslation />
                <TranslationPopperExplanation />
                <TranslationPopperPronunciation />
                {translatingWord && <CircularProgress />}
            </Paper>
        </StyledPopper>
    );
}

const StyledPopper = styled(Popper)(() => ({
    zIndex: 1,
    maxWidth: '375px',
    '&[data-popper-placement*="bottom"] .arrow': {
        top: 0,
        left: 0,
        marginTop: '-0.9em',
        width: '3em',
        height: '1em',
        '&::before': {
            borderWidth: '0 1em 1em 1em',
            borderColor: `transparent transparent ${POPPER_BG_COLOR} transparent`,
        },
    },
    '&[data-popper-placement*="top"] .arrow': {
        bottom: 0,
        left: 0,
        marginBottom: '-0.9em',
        width: '3em',
        height: '1em',
        '&::before': {
            borderWidth: '1em 1em 0 1em',
            borderColor: `${POPPER_BG_COLOR} transparent transparent transparent`,
        },
    },
}));