import { useCallback, useMemo } from 'react';
import {
    Popper,
    Paper,
    IconButton,
} from 'src/design-system/components';
import { ContentCopyIcon, DeleteIcon, TranslateIcon } from 'src/design-system/icons';
import type { VirtualElement } from 'src/design-system/types';
import { dictionaryStateMachineActor } from 'src/features/dictionary/state';
import { bookFrameStateMachineActor, useBookFrameStateSelect } from '../../state';

const POPPER_OFFSET = 8;

export function BookFrameTextSelectionControls() {
    const textSelection = useBookFrameStateSelect('textSelection');
    const selectionUpdatedAt = useBookFrameStateSelect('textSelectionCreateEndTime');
    const selectedHighlight = useBookFrameStateSelect('selectedHighlight');
    const iframeEl = useBookFrameStateSelect('iframeEl');

    const virtualElement = useMemo<VirtualElement | null>(() => {
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
        if (!selectedHighlight) {
            return;
        }
        dictionaryStateMachineActor.send({
            type: 'REQUEST_TRANSLATION',
            highlight: selectedHighlight,
        });
        bookFrameStateMachineActor.send({ type: 'REQUEST_TRANSLATION' });
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
                    <IconButton
                        size="small"
                        sx={{
                            color: 'inherit',
                            padding: '6px',
                        }}
                        onClick={removeHighlightHandler}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                )}
                <IconButton
                    size="small"
                    sx={{
                        color: 'inherit',
                        padding: '6px',
                    }}
                    onClick={copyHandler}
                >
                    <ContentCopyIcon fontSize="small" />
                </IconButton>
                <IconButton
                    size="small"
                    sx={{
                        color: 'inherit',
                        padding: '6px',
                    }}
                    onClick={translateHandler}
                >
                    <TranslateIcon fontSize="small" />
                </IconButton>
            </Paper>
        </Popper>
    );
}
