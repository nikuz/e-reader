import { useCallback, type SyntheticEvent } from 'react';
import { useBookFrameStateSelect, bookFrameStateMachineActor } from '../../state';

export default function BookFrameNavigationEpub3() {
    const book = useBookFrameStateSelect('book');
    const readProgress = useBookFrameStateSelect('readProgress');

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

        // Highlight current chapter and scroll into view
        if (readProgress?.chapter) {
            const currentChapterPath = book.spine[readProgress.chapter].filePath;

            // Find the link that matches the current chapter
            const links = toc.querySelectorAll('a');
            let currentLink: HTMLAnchorElement | null = null;

            for (const link of Array.from(links)) {
                const href = link.getAttribute('href');
                if (href && currentChapterPath.endsWith(href)) {
                    currentLink = link as HTMLAnchorElement;
                    break;
                }
            }

            if (currentLink) {
                // Add a check indicator to mark as current
                const indicator = iframeDocument.createElement('span');
                indicator.className = 'current-chapter-indicator';
                indicator.textContent = '✓ ';
                indicator.style.marginRight = '4px';
                indicator.style.color = '#4caf50';
                currentLink.insertBefore(indicator, currentLink.firstChild);

                // Mark the link as current
                currentLink.classList.add('current-chapter');

                // Expand all parent sections
                let parentElement = currentLink.parentElement;
                while (parentElement && parentElement !== toc) {
                    if (parentElement.tagName.toLowerCase() === 'li' && parentElement.classList.contains('has-children')) {
                        const nestedList = parentElement.querySelector('ol');
                        const toggle = parentElement.querySelector('.toc-toggle');

                        if (nestedList) {
                            nestedList.style.display = 'block';
                            parentElement.classList.remove('collapsed');
                            parentElement.classList.add('expanded');
                            toggle?.setAttribute('aria-expanded', 'true');
                            toggle?.setAttribute('aria-label', 'Collapse section');
                        }
                    }
                    parentElement = parentElement.parentElement;
                }

                // Scroll the current link into view
                currentLink.scrollIntoView({ block: 'center' });
            }
        }

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

    if (!book?.navigationEpub3Src) {
        return;
    }

    return (
        <iframe
            src={book.navigationEpub3Src}
            className="w-full h-full border-0 bg-black"
            sandbox="allow-same-origin allow-scripts"
            onLoad={frameContentLoadHandler}
        />
    );
}
