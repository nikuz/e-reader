import { useCallback, useMemo } from 'react';
import {
    Popper,
    Paper,
    IconButton,
} from 'src/design-system/components';
import { ContentCopyIcon } from 'src/design-system/icons';
import type { VirtualElement } from 'src/design-system/types';
import { useBookFrameStateSelect } from '../../state';

const POPPER_OFFSET = 8;

export function BookFrameTextSelectionControls() {
    const textSelection = useBookFrameStateSelect('textSelection');
    const selectionUpdatedAt = useBookFrameStateSelect('textSelectionCreateEndtimeTime');
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

    const handleCopy = useCallback(async () => {
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
                    borderRadius: '100%',
                    backgroundColor: 'rgba(33, 33, 33, 0.9)',
                    color: '#fff',
                }}
            >
                <IconButton
                    size="small"
                    sx={{
                        color: 'inherit',
                        padding: '6px',
                    }}
                    onClick={handleCopy}
                >
                    <ContentCopyIcon fontSize="small" />
                </IconButton>
            </Paper>
        </Popper>
    );
}
