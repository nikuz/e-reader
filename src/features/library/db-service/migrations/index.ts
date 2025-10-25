import { initiation } from './initiation';
import { addHighlightsColumn } from './add-highlights-column';

const migrations = [
    initiation,
    addHighlightsColumn,
];

export default migrations;