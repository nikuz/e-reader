import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { AddIcon, RemoveIcon } from '../../icons';

interface Props {
    label: string,
    value: number,
    step?: number,
    onChange: (value: number) => void,
}

export function Stepper({ label, value, step = 1, onChange }: Props) {
    const fixValue = (value: number): number => {
        if (step - Math.trunc(step) !== 0) {
            return Number(value.toFixed(1));
        }
        return value;
    };

    const decreaseHandler = () => {
        onChange(fixValue(value - step));
    };

    const increaseHandler = () => {
        onChange(fixValue(value + step));
    };

    return (
        <Box className="flex flex-1 items-center">
            <Typography className="flex-1">
                {label}
            </Typography>
            <Typography marginRight={2}>
                {value}
            </Typography>
            <ButtonGroup variant="outlined" size="small">
                <Button sx={{ pl: 0, pr: 0 }} onClick={decreaseHandler}>
                    <RemoveIcon />
                </Button>
                <Button sx={{ pl: 0, pr: 0 }} onClick={increaseHandler}>
                    <AddIcon />
                </Button>
            </ButtonGroup>
        </Box>
    );
}
