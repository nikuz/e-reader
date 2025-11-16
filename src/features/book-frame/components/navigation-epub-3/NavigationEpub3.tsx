import { useCallback, type SyntheticEvent } from 'react';
import MUIDrawer from '@mui/material/SwipeableDrawer';
import {
    useBookFrameStateSelect,
    useBookFrameStateMatch,
    bookFrameStateMachineActor,
} from '../../state';

export function BookFrameNavigationEpub3() {
    const book = useBookFrameStateSelect('book');
    const readProgress = useBookFrameStateSelect('readProgress');
    const navigationOpened = useBookFrameStateMatch(['NAVIGATION_OPENED']);

    const frameContentLoadHandler = useCallback((event: SyntheticEvent<HTMLIFrameElement>) => {
        const iframeEl = event.currentTarget;
        const iframeDocument = iframeEl.contentDocument;
        const toc = iframeDocument?.querySelector('nav');

        if (!book || !iframeDocument || !toc) {
            return;
        }
        
        // Find all list items that have nested <ol> elements
        toc.querySelectorAll('li').forEach(li => {
            const nestedList = li.querySelector('ol');

            if (nestedList) {
                // Mark this as expandable
                li.classList.add('has-children');

                // Initially collapse the nested list
                nestedList.style.display = 'none';
                li.classList.add('collapsed');

                // Create a toggle button/indicator
                const toggle = iframeDocument.createElement('button');
                toggle.className = 'toc-toggle';
                toggle.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-label', 'Expand section');

                // Insert the toggle before the link
                const link = li.querySelector('a');
                li.insertBefore(toggle, link);

                // Handle click on toggle
                toggle.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    const isCollapsed = li.classList.contains('collapsed');

                    if (isCollapsed) {
                        nestedList.style.display = 'block';
                        li.classList.remove('collapsed');
                        li.classList.add('expanded');
                        toggle.setAttribute('aria-expanded', 'true');
                        toggle.setAttribute('aria-label', 'Collapse section');
                    } else {
                        nestedList.style.display = 'none';
                        li.classList.add('collapsed');
                        li.classList.remove('expanded');
                        toggle.setAttribute('aria-expanded', 'false');
                        toggle.setAttribute('aria-label', 'Expand section');
                    }
                });
            }
        });

        // handle navigation links clicks
        toc.addEventListener('click', (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();

            const target = event.target as HTMLElement;
            if (target?.nodeName.toLocaleLowerCase() !== 'a') {
                return;
            }

            const href = target.getAttribute('href');
            if (!href) {
                return;
            }

            for (const chapter of book.spine) {
                if (chapter.filePath.endsWith(href)) {
                    bookFrameStateMachineActor.send({
                        type: 'NAVIGATE',
                        chapter,
                    });
                    break;
                }
            }
        });
    }, [book, readProgress]);

    const closeHandler = useCallback(() => {
        bookFrameStateMachineActor.send({ type: 'NAVIGATION_CLOSE' });
    }, []);

    if (!book?.navigationEpub3Src) {
        return;
    }

    return (
        <MUIDrawer
            open={navigationOpened}
            anchor="left"
            ModalProps={{
                keepMounted: false,
            }}
            disableDiscovery
            disableSwipeToOpen
            onClose={closeHandler}
            onOpen={() => { }}
        >
            <iframe
                src={book.navigationEpub3Src}
                className="w-full h-full border-0 bg-black"
                sandbox="allow-same-origin allow-scripts"
                onLoad={frameContentLoadHandler}
            />
        </MUIDrawer>
    );
}
