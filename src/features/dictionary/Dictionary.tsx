import { onMount } from 'solid-js';
import { Typography } from 'src/design-system/components';
import { dictionaryStateMachineActor } from './state';

export default function Dictionary() {
    onMount(() => {
        dictionaryStateMachineActor.send({ type: 'INITIALIZE' });
    });

    return (
        <div>
            <Typography variant="h6" class="text-center mt-2!">Dictionary</Typography>
        </div>
    );
}