import { Box } from 'src/design-system/components';
import { useBookFrameStateSelect } from '../../state';

export function BookFrameStats() {
    const chapterRect = useBookFrameStateSelect('chapterRect');
    const screenRect = useBookFrameStateSelect('screenRect');
    const scrollPosition = useBookFrameStateSelect('scrollPosition');
    const currentPage = Math.round(scrollPosition / screenRect.width) + 1;
    const chapterPages = Math.round(chapterRect.width / screenRect.width);

    return (
        <Box className="text-center text-[10px] text-gray-500">
            {currentPage} / {chapterPages}
        </Box>
    );
}