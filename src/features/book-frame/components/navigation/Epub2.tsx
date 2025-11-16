import { useCallback, useState, useEffect, useRef } from 'react';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton,
    Box,
} from 'src/design-system/components';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckIcon from '@mui/icons-material/Check';
import { useBookFrameStateSelect, bookFrameStateMachineActor } from '../../state';
import type { BookNavigationEpub2NavPoint } from 'src/types';

interface NavigationItemProps {
    navPoint: BookNavigationEpub2NavPoint;
    level: number;
    currentChapterPath?: string;
}

// Helper function to check if a navPoint or its children contain the current chapter
function containsCurrentChapter(navPoint: BookNavigationEpub2NavPoint, currentChapterPath?: string): boolean {
    if (!currentChapterPath) {
        return false;
    }

    // Check if this navPoint is the current chapter
    if (currentChapterPath.endsWith(navPoint.src)) {
        return true;
    }

    // Recursively check children
    return navPoint.children.some(child => containsCurrentChapter(child, currentChapterPath));
}

function NavigationItem({ navPoint, level, currentChapterPath }: NavigationItemProps) {
    const hasChildren = navPoint.children.length > 0;
    const book = useBookFrameStateSelect('book');
    const itemRef = useRef<HTMLLIElement>(null);

    // Auto-expand if this section contains the current chapter
    const shouldAutoExpand = hasChildren && containsCurrentChapter(navPoint, currentChapterPath);
    const [isExpanded, setIsExpanded] = useState(shouldAutoExpand);

    // Check if this navigation item is the current chapter
    const isCurrent = currentChapterPath && book?.spine.some(
        chapter => chapter.filePath.endsWith(navPoint.src)
    );

    // Scroll current item into view
    useEffect(() => {
        if (isCurrent && itemRef.current) {
            itemRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
    }, [isCurrent]);

    const handleNavigate = useCallback(() => {
        if (!book) {
            return;
        }

        // Find the chapter that matches this navigation item
        for (const chapter of book.spine) {
            if (chapter.filePath.endsWith(navPoint.src)) {
                bookFrameStateMachineActor.send({
                    type: 'NAVIGATE',
                    chapter,
                });
                break;
            }
        }
    }, [book, navPoint.src]);

    const handleToggle = useCallback((event: React.MouseEvent) => {
        event.stopPropagation();
        setIsExpanded(!isExpanded);
    }, [isExpanded]);

    return (
        <>
            <ListItem
                ref={itemRef}
                disablePadding
                component="li"
                sx={{
                    pl: level * 2,
                }}
            >
                {hasChildren && (
                    <IconButton
                        size="small"
                        onClick={handleToggle}
                        sx={{ mr: 1 }}
                        aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
                    >
                        {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                    </IconButton>
                )}
                <ListItemButton
                    onClick={handleNavigate}
                    sx={{
                        pl: hasChildren ? 0 : 4,
                        bgcolor: isCurrent ? 'action.selected' : 'transparent',
                    }}
                >
                    {isCurrent && (
                        <CheckIcon
                            sx={{
                                mr: 1,
                                fontSize: '1.2rem',
                                color: 'success.main',
                            }}
                        />
                    )}
                    <ListItemText
                        primary={navPoint.text}
                        primaryTypographyProps={{
                            fontSize: '0.95rem',
                            fontWeight: isCurrent ? 600 : 400,
                        }}
                    />
                </ListItemButton>
            </ListItem>
            {hasChildren && isExpanded && navPoint.children.map((child, index) => (
                <NavigationItem
                    key={`${index}-${currentChapterPath || 'none'}`}
                    navPoint={child}
                    level={level + 1}
                    currentChapterPath={currentChapterPath}
                />
            ))}
        </>
    );
}

export default function BookFrameNavigationEpub2() {
    const book = useBookFrameStateSelect('book');
    const readProgress = useBookFrameStateSelect('readProgress');

    if (!book?.navigationEpub2?.navMap) {
        return null;
    }

    const currentChapterPath = readProgress?.chapter !== undefined
        ? book.spine[readProgress.chapter]?.filePath
        : undefined;

    return (
        <Box className="h-full overflow-y-auto">
            <List disablePadding>
                {book.navigationEpub2.navMap.map((navPoint, index) => (
                    <NavigationItem
                        key={`${index}-${currentChapterPath || 'none'}`}
                        navPoint={navPoint}
                        level={0}
                        currentChapterPath={currentChapterPath}
                    />
                ))}
            </List>
        </Box>
    );
}
