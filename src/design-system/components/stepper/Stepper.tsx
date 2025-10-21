import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { AddIcon, RemoveIcon } from '../../icons';

interface Props {
    label: string,
    value: number,
    step?: number,
    min?: number,
    max?: number,
    onChange: (value: number) => void,
}

export function Stepper({
    label,
    value,
    step = 1,
    min,
    max,
    onChange,
}: Props) {
    const fixValue = (value: number): number => {
        if (step - Math.trunc(step) !== 0) {
            return Number(value.toFixed(1));
        }
        return value;
    };

    const clampValue = (value: number): number => {
        let clampedValue = value;

        if (min !== undefined) {
            clampedValue = Math.max(clampedValue, min);
        }
        if (max !== undefined) {
            clampedValue = Math.min(clampedValue, max);
        }

        return clampedValue;
    };

    const decreaseHandler = () => {
        onChange(clampValue(fixValue(value - step)));
    };

    const increaseHandler = () => {
        onChange(clampValue(fixValue(value + step)));
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
                <Button
                    disabled={value === min}
                    sx={{ pl: 0, pr: 0 }}
                    onClick={decreaseHandler}
                >
                    <RemoveIcon />
                </Button>
                <Button
                    disabled={value === max}
                    sx={{ pl: 0, pr: 0 }}
                    onClick={increaseHandler}
                >
                    <AddIcon />
                </Button>
            </ButtonGroup>
        </Box>
    );
}
