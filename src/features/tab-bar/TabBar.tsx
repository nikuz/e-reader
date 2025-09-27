import { VsLibrary } from 'solid-icons/vs';
import { AiFillRead } from 'solid-icons/ai';
import { BsViewList } from 'solid-icons/bs';
import { VsSettings } from 'solid-icons/vs';

export default function TabBar() {
    return (
        <div class="dock">
            <button>
                <VsLibrary />
                <span class="dock-label">Library</span>
            </button>

            <button class="dock-active">
                <AiFillRead />
                <span class="dock-label">Book</span>
            </button>

            <button>
                <BsViewList />
                <span class="dock-label">Dictionary</span>
            </button>

            <button>
                <VsSettings />
                <span class="dock-label">Settings</span>
            </button>
        </div>
    );
}