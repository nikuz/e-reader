import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from 'src/App';
import Library from 'src/features/library';
import BookFrame from 'src/features/book-frame';
import Dictionary from 'src/features/dictionary';
import { RouterPath } from './constants';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={RouterPath.HOME} element={<App />}>
                    <Route element={<Navigate to={RouterPath.LIBRARY} />} />
                    <Route path={RouterPath.LIBRARY} element={<Library />} />
                    <Route path={RouterPath.BOOK} element={<BookFrame />} />
                    <Route path={RouterPath.DICTIONARY} element={<Dictionary />} />
                    <Route path="*" element={null} /> 
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
