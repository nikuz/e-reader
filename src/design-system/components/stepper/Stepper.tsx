import Box from '@suid/material/Box';
import Typography from '@suid/material/Typography';
import ButtonGroup from '@suid/material/ButtonGroup';
import Button from '@suid/material/Button';
import { AddIcon, RemoveIcon } from '../../icons';

interface Props {
    label: string,
    value: number,
    step?: number,
    onChange: (value: number) => void,
}

export function Stepper(props: Props) {
    const step = props.step ?? 1;

    const decreaseHandler = () => {
        props.onChange(props.value - step);
    };

    const increaseHandler = () => {
        props.onChange(props.value + step);
    };

    return (
        <Box class="flex flex-1 items-center">
            <Typography class="flex-1">
                {props.label}
            </Typography>
            <Typography marginRight={2}>
                {props.value}
            </Typography>
            <ButtonGroup variant="outlined" size="small">
                <Button
                    sx={{ pl: 0, pr: 0 }}
                    onClick={decreaseHandler}
                >
                    <RemoveIcon />
                </Button>
                <Button
                    sx={{ pl: 0, pr: 0 }}
                    onClick={increaseHandler}
                >
                    <AddIcon />
                </Button>
            </ButtonGroup>
        </Box>
    );
}