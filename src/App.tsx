import { createSignal } from 'solid-js';
import BookFrame from './features/book-frame';
import './App.css';

export default function App() {
    const [bookUrl] = createSignal('books/Will of the Many, The - James Islington/9781982141196.opf');

    return (
        <div class="content">
            <BookFrame
                src={bookUrl()}
            />
        </div>
    );
};
