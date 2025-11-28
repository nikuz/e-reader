import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Popper, Paper, Box, Typography, Button } from 'src/design-system/components';
import { CloudOffIcon } from 'src/design-system/icons';
import { styled } from 'src/design-system/styles';
import type { PopperVirtualElement, PopperInstance } from 'src/design-system/types';
import { dictionaryStateMachineActor, useDictionaryStateSelect } from 'src/features/dictionary/state';
import { useSettingsStateSelect } from 'src/features/settings/state';
import { useLast } from 'src/hooks';
import { Languages } from 'src/types';
import {
    useBookFrameStateSelect,
    useBookFrameStateMatch,
} from '../../state';
import TranslationPopperLoading from './TranslationPopperLoading';
import TranslationPopperTranslation from './TranslationPopperTranslation';
import TranslationPopperExplanation from './TranslationPopperExplanation';
import TranslationPopperPronunciation from './TranslationPopperPronunciation';
import TranslationPopperImage from './TranslationPopperImage';

const POPPER_OFFSET = 8;
const POPPER_BG_COLOR = '#2F2F2F';

export function BookFrameTranslationPopper() {
    const [arrowEl, setArrowEl] = useState<HTMLSpanElement | null>(null);
    const book = useBookFrameStateSelect('book');
    const iframeEl = useBookFrameStateSelect('iframeEl');
    const selectedHighlight = useBookFrameStateSelect('selectedHighlight');
    const isAnalyzingWord = useBookFrameStateMatch(['ANALYZING_WORD']);
    const lastIsAnalyzingWord = useLast(isAnalyzingWord);
    const translatingWord = useDictionaryStateSelect('translatingWord');
    const dictionaryErrorMessage = useDictionaryStateSelect('errorMessage');
    const dictionarySettings = useSettingsStateSelect('dictionary');
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

    const retryAnalysisHandler = useCallback(() => {
        if (!book || !selectedHighlight || !translatingWord) {
            return;
        }
        dictionaryStateMachineActor.send({ type: 'CLEAR_ERROR_MESSAGE' });
        dictionaryStateMachineActor.send({
            type: 'REQUEST_WORD_ANALYSIS',
            bookId: book.eisbn,
            highlight: selectedHighlight,
            sourceLanguage: Languages.ENGLISH,
            targetLanguage: Languages.RUSSIAN,
            useAIVoice: dictionarySettings.useAIVoice,
            showTranslation: dictionarySettings.showTranslation,
        });
    }, [book, selectedHighlight, translatingWord, dictionarySettings]);

    useEffect(() => {
        if (!translatingWord) {
            return;
        }
        popperRef.current?.forceUpdate();
    }, [translatingWord]);

    useEffect(() => {
        if (!isAnalyzingWord && lastIsAnalyzingWord) {
            dictionaryStateMachineActor.send({ type: 'CLEAR_WORD_SELECTION' });
        }
    }, [isAnalyzingWord, lastIsAnalyzingWord]);

    useEffect(() => {
        if (dictionaryErrorMessage && !isAnalyzingWord) {
            dictionaryStateMachineActor.send({ type: 'CLEAR_ERROR_MESSAGE' });
        }
    }, [isAnalyzingWord, dictionaryErrorMessage]);

    if (!isAnalyzingWord || !selectedHighlight || !virtualElement) {
        return null;
    }

    return <>
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
                    boxShadow: '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
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
                {dictionaryErrorMessage && (
                    <Box className="text-center">
                        <CloudOffIcon fontSize="large" color="error" />
                        <Typography marginTop="5px" marginBottom="10px">
                            {dictionaryErrorMessage}
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={retryAnalysisHandler}
                        >
                            Retry
                        </Button>
                    </Box>
                )}
                {!dictionaryErrorMessage && (
                    <Box sx={{ overflow: 'hidden' }}>
                        <Box sx={{ float: 'right', ml: 1, mt: -0.5 }}>
                            <TranslationPopperPronunciation />
                            <TranslationPopperImage />
                        </Box>
                        <Box className="flex-1">
                            <TranslationPopperLoading />
                            <TranslationPopperTranslation />
                            <TranslationPopperExplanation />
                        </Box>
                    </Box>
                )}
            </Paper>
        </StyledPopper>
    </>;
}

const StyledPopper = styled(Popper)(() => ({
    zIndex: 1,
    width: '50%',
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