import { useState, useRef } from 'react';
import {
    ListItem,
    ListItemText,
    Box,
} from 'src/design-system/components';
import DeleteIcon from '@mui/icons-material/Delete';
import { DictionaryWordPronunciationButton } from '../word-pronunciation-button';
import type { DictionaryWord } from '../../types';

interface Props {
    word: DictionaryWord;
    onDelete?: (word: DictionaryWord) => void;
}

export function WordsListItem(props: Props) {
    const { word, onDelete } = props;
    const [translateX, setTranslateX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const touchStartX = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        setIsDragging(true);
        setIsAnimating(false);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;

        const currentX = e.touches[0].clientX;
        const diff = touchStartX.current - currentX;

        // Only allow swipe from right to left (positive diff)
        if (diff > 0) {
            setTranslateX(diff);
        } else {
            setTranslateX(0);
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        setIsAnimating(true);

        const containerWidth = containerRef.current?.offsetWidth || 0;
        const threshold = containerWidth * 0.3;

        if (translateX >= threshold) {
            // Delete the item
            setTranslateX(containerWidth);
            setTimeout(() => {
                setIsDeleting(true);
                setTimeout(() => {
                    onDelete?.(word);
                }, 300);
            }, 300);
        } else {
            // Reset position
            setTranslateX(0);
        }
    };

    return (
        <Box
            ref={containerRef}
            sx={{
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#d32f2f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: 2,
                height: isDeleting ? 0 : 60,
                transition: isDeleting ? 'height 0.3s ease-out' : 'none',
            }}
        >
            <DeleteIcon sx={{ color: 'white', fontSize: 28 }} />
            <Box
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'background.paper',
                    transform: `translateX(-${translateX}px)`,
                    transition: isAnimating ? 'transform 0.3s ease-out' : 'none',
                    touchAction: 'pan-y', // Allow vertical scrolling
                }}
            >
                <ListItem
                    secondaryAction={<DictionaryWordPronunciationButton word={word} />}
                    sx={{ height: '100%' }}
                >
                    <ListItemText
                        primary={word.text}
                        secondary={word.translation}
                    />
                </ListItem>
            </Box>
        </Box>
    );
}
