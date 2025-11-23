import { useRef, useCallback, useMemo, useEffect, useEffectEvent } from 'react';
import {
    Popper,
    Paper,
    IconButton,
} from 'src/design-system/components';
import { ContentCopyIcon, DeleteIcon, TranslateIcon } from 'src/design-system/icons';
import type { PopperVirtualElement } from 'src/design-system/types';
import { dictionaryStateMachineActor } from 'src/features/dictionary/state';
import { Languages } from 'src/features/dictionary/constants';
import { bookFrameStateMachineActor, useBookFrameStateSelect } from '../../state';

const POPPER_OFFSET = 8;

export function BookFrameTextSelectionControls() {
    const book = useBookFrameStateSelect('book');
    const textSelection = useBookFrameStateSelect('textSelection');
    const selectionUpdatedAt = useBookFrameStateSelect('textSelectionCreateEndTime');
    const selectedHighlight = useBookFrameStateSelect('selectedHighlight');
    const iframeEl = useBookFrameStateSelect('iframeEl');
    const storeHighlightRequested = useRef(false);

    const virtualElement = useMemo<PopperVirtualElement | null>(() => {
        if (!textSelection || !iframeEl || textSelection.rangeCount === 0) {
            return null;
        }

        const updatedAt = selectionUpdatedAt ?? 0;
        if (!textSelection.toString().trim()) {
            return null;
        }

        const getBoundingClientRect = () => {
            void updatedAt;
            if (!iframeEl || !textSelection || textSelection.rangeCount === 0) {
                return new DOMRect();
            }

            const rangeRect = textSelection.getRangeAt(0).getBoundingClientRect();
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
    }, [iframeEl, textSelection, selectionUpdatedAt]);

    const copyHandler = useCallback(async () => {
        if (!textSelection) {
            return;
        }

        const text = textSelection.toString();

        if (!text.trim()) {
            return;
        }

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
            }
        } catch (error) {
            console.error('Failed to copy selected text', error);
        }
    }, [textSelection]);

    const removeHighlightHandler = useCallback(() => {
        if (!selectedHighlight) {
            return;
        }
        bookFrameStateMachineActor.send({
            type: 'DELETE_HIGHLIGHT',
            highlight: selectedHighlight,
        });
    }, [selectedHighlight]);
    
    const translateHandler = useCallback(() => {
        if (!book) {
            return;
        }
        if (selectedHighlight) {
            dictionaryStateMachineActor.send({
                type: 'REQUEST_WORD_ANALYSIS',
                bookId: book.eisbn,
                highlight: selectedHighlight,
                sourceLanguage: Languages.ENGLISH,
                targetLanguage: Languages.RUSSIAN,
            });
            bookFrameStateMachineActor.send({ type: 'REQUEST_WORD_ANALYSIS' });
        } else {
            storeHighlightRequested.current = true;
            bookFrameStateMachineActor.send({ type: 'STORE_HIGHLIGHT' });
        }
    }, [book, selectedHighlight]);

    const requestWordAnalysis = useEffectEvent(() => {
        if (!book || !selectedHighlight) {
            return;
        }
        dictionaryStateMachineActor.send({
            type: 'REQUEST_WORD_ANALYSIS',
            bookId: book.eisbn,
            highlight: selectedHighlight,
            sourceLanguage: Languages.ENGLISH,
            targetLanguage: Languages.RUSSIAN,
        });
        bookFrameStateMachineActor.send({ type: 'REQUEST_WORD_ANALYSIS' });
    });
    
    useEffect(() => {
        if (selectedHighlight && storeHighlightRequested.current) {
            storeHighlightRequested.current = false;
            requestWordAnalysis();
        }
    }, [selectedHighlight]);

    if (!virtualElement) {
        return null;
    }

    return (
        <Popper
            open
            anchorEl={virtualElement}
            placement="top"
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
                        fallbackPlacements: ['bottom'],
                    },
                },
                {
                    name: 'preventOverflow',
                    options: {
                        altBoundary: true,
                        padding: 8,
                    },
                },
            ]}
        >
            <Paper
                elevation={6}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.25,
                    padding: '4px',
                    backgroundColor: 'rgba(33, 33, 33, 0.9)',
                    color: '#fff',
                }}
            >
                {selectedHighlight && (
                    <IconButton onClick={removeHighlightHandler}>
                        <DeleteIcon />
                    </IconButton>
                )}
                <IconButton onClick={copyHandler}>
                    <ContentCopyIcon />
                </IconButton>
                <IconButton onClick={translateHandler}>
                    <TranslateIcon />
                </IconButton>
            </Paper>
        </Popper>
    );
}
