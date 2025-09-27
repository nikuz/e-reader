import { JSX } from 'solid-js';
import Debug from './features/debug';
import TabBar from './features/tab-bar';
import './App.css';

interface Props {
    children?: JSX.Element,
}

export default function App(props: Props) {
    return (
        <div class="content">
            {props.children}
            <TabBar />
            <Debug />
        </div>
    );
};
