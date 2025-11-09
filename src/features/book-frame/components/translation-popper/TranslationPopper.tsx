import { useState, useRef, useMemo, useEffect } from 'react';
import { Popper, Paper, Box } from 'src/design-system/components';
import { styled } from 'src/design-system/styles';
import type { PopperVirtualElement, PopperInstance } from 'src/design-system/types';
import { useDictionaryStateSelect, dictionaryStateMachineActor } from 'src/features/dictionary/state';
import { useLast } from 'src/hooks';
import {
    useBookFrameStateSelect,
    useBookFrameStateMatch,
} from '../../state';
import TranslationPopperTranslation from './TranslationPopperTranslation';
import TranslationPopperExplanation from './TranslationPopperExplanation';
import TranslationPopperPronunciation from './TranslationPopperPronunciation';
import TranslationPopperImage from './TranslationPopperImage';

const POPPER_OFFSET = 8;
const POPPER_BG_COLOR = '#262626';

export function TranslationPopper() {
    const [arrowEl, setArrowEl] = useState<HTMLSpanElement | null>(null);
    const iframeEl = useBookFrameStateSelect('iframeEl');
    const selectedHighlight = useBookFrameStateSelect('selectedHighlight');
    const isAnalyzingWord = useBookFrameStateMatch(['ANALYZING_WORD']);
    const lastIsAnalyzingWord = useLast(isAnalyzingWord);
    const translatingWord = useDictionaryStateSelect('translatingWord');
    const selectedWord = useDictionaryStateSelect('selectedWord');
    const popperRef = useRef<PopperInstance | null>(null);

    const virtualElement = useMemo<PopperVirtualElement | null>(() => {
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

    useEffect(() => {
        if (!translatingWord && !selectedWord) {
            return;
        }
        popperRef.current?.forceUpdate();
    }, [translatingWord, selectedWord]);

    useEffect(() => {
        if (!isAnalyzingWord && lastIsAnalyzingWord) {
            dictionaryStateMachineActor.send({ type: 'CLEAR_WORD_SELECTION' });
        }
    }, [isAnalyzingWord, lastIsAnalyzingWord]);

    if (!isAnalyzingWord || !selectedHighlight || !virtualElement) {
        return null;
    }

    return (
        <StyledPopper
            open={true}
            placement="bottom"
            anchorEl={virtualElement}
            popperRef={popperRef}
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
                <Box>
                    <Box sx={{ float: 'right', ml: 1, mt: -0.5 }}>
                        <TranslationPopperPronunciation />
                        <TranslationPopperImage />
                    </Box>
                    <Box className="flex-1">
                        <TranslationPopperTranslation />
                        <TranslationPopperExplanation />
                    </Box>
                </Box>
            </Paper>
        </StyledPopper>
    );
}

const StyledPopper = styled(Popper)(() => ({
    zIndex: 1,
    width: '50%',
    maxWidth: '375px',
    maxHeight: '300px',
    overflow: 'auto',
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