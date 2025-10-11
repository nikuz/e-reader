import { onMount } from 'solid-js';
import { dictionaryStateMachineActor } from './state';

export default function Dictionary() {
    onMount(() => {
        dictionaryStateMachineActor.send({ type: 'INITIALIZE' });
    });

    return (
        <div>
            <h1 class="text-center mt-2 text-lg">Dictionary</h1>
        </div>
    );
}