import { useCallback, useEffect, useRef } from 'react';
import type {
    FocusEvent as ReactFocusEvent,
    MouseEvent as ReactMouseEvent,
    PointerEvent as ReactPointerEvent,
} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { AddIcon, RemoveIcon } from '../../icons';

const HOLD_DELAY_MS = 400;
const HOLD_INTERVAL_MS = 100;
const TOUCH_ACTIVATION_DELAY_MS = 150;
const TOUCH_MOVE_CANCEL_THRESHOLD_PX = 6;

interface RepeatHandlers {
    onClick: (event: ReactMouseEvent<HTMLButtonElement>) => void;
    onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void;
    onPointerUp: () => void;
    onPointerMove: (event: ReactPointerEvent<HTMLButtonElement>) => void;
    onPointerLeave: (event: ReactPointerEvent<HTMLButtonElement>) => void;
    onPointerCancel: () => void;
    onBlur: (event: ReactFocusEvent<HTMLButtonElement>) => void;
}

// Handles hold-to-repeat interactions for a single button instance.
function useRepeatPress(changeFn: () => void): RepeatHandlers {
    const repeatTimeoutRef = useRef<number | null>(null);
    const repeatIntervalRef = useRef<number | null>(null);
    const activationTimeoutRef = useRef<number | null>(null);
    const clickResetTimeoutRef = useRef<number | null>(null);
    const isPressingRef = useRef(false);
    const ignoreClickRef = useRef(false);
    const pendingActivationRef = useRef(false);
    const pointerOriginRef = useRef<{ x: number; y: number } | null>(null);
    const pointerMovedRef = useRef(false);

    const cancelPendingActivation = useCallback(() => {
        if (activationTimeoutRef.current !== null) {
            window.clearTimeout(activationTimeoutRef.current);
            activationTimeoutRef.current = null;
        }
        pendingActivationRef.current = false;
    }, []);

    const clearPointerTracking = useCallback(() => {
        pointerOriginRef.current = null;
        pointerMovedRef.current = false;
    }, []);

    const clearPressTimers = useCallback(() => {
        if (repeatTimeoutRef.current !== null) {
            window.clearTimeout(repeatTimeoutRef.current);
            repeatTimeoutRef.current = null;
        }
        if (repeatIntervalRef.current !== null) {
            window.clearInterval(repeatIntervalRef.current);
            repeatIntervalRef.current = null;
        }
        if (clickResetTimeoutRef.current !== null) {
            window.clearTimeout(clickResetTimeoutRef.current);
            clickResetTimeoutRef.current = null;
        }
        cancelPendingActivation();
    }, [cancelPendingActivation]);

    const scheduleClickReset = useCallback(() => {
        if (clickResetTimeoutRef.current !== null) {
            window.clearTimeout(clickResetTimeoutRef.current);
        }
        clickResetTimeoutRef.current = window.setTimeout(() => {
            ignoreClickRef.current = false;
            clickResetTimeoutRef.current = null;
        }, 0);
    }, []);

    const beginPress = useCallback(() => {
        cancelPendingActivation();
        if (isPressingRef.current) {
            return;
        }

        isPressingRef.current = true;
        ignoreClickRef.current = true;

        changeFn();
        clearPressTimers();

        repeatTimeoutRef.current = window.setTimeout(() => {
            changeFn();
            repeatIntervalRef.current = window.setInterval(changeFn, HOLD_INTERVAL_MS);
        }, HOLD_DELAY_MS);
    }, [cancelPendingActivation, changeFn, clearPressTimers]);

    useEffect(() => () => {
        clearPressTimers();
    }, [clearPressTimers]);

    const stopPress = useCallback((resetClickImmediately: boolean) => {
        const hadPendingActivation = pendingActivationRef.current;

        if (hadPendingActivation) {
            cancelPendingActivation();
            ignoreClickRef.current = true;
            scheduleClickReset();
        }

        if (!isPressingRef.current) {
            if (resetClickImmediately) {
                ignoreClickRef.current = false;
            }
            clearPointerTracking();
            return;
        }

        isPressingRef.current = false;
        clearPressTimers();

        if (resetClickImmediately) {
            ignoreClickRef.current = false;
        }
        clearPointerTracking();
    }, [cancelPendingActivation, clearPointerTracking, clearPressTimers, scheduleClickReset]);

    const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
        if (event.pointerType === 'mouse' && event.button !== 0) {
            return;
        }

        if (event.currentTarget.disabled || isPressingRef.current || pendingActivationRef.current) {
            return;
        }

        pointerMovedRef.current = false;

        if (event.pointerType === 'touch') {
            pointerOriginRef.current = {
                x: event.clientX,
                y: event.clientY,
            };
            pendingActivationRef.current = true;
            activationTimeoutRef.current = window.setTimeout(() => {
                beginPress();
            }, TOUCH_ACTIVATION_DELAY_MS);
            return;
        }

        beginPress();
    }, [beginPress]);

    const handlePointerUp = useCallback(() => {
        if (pendingActivationRef.current) {
            const shouldTriggerTap = !pointerMovedRef.current;
            cancelPendingActivation();

            if (shouldTriggerTap) {
                ignoreClickRef.current = true;
                changeFn();
            } else {
                ignoreClickRef.current = true;
                scheduleClickReset();
            }
            clearPointerTracking();
            return;
        }

        stopPress(false);
    }, [cancelPendingActivation, changeFn, clearPointerTracking, scheduleClickReset, stopPress]);

    const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
        if (!pendingActivationRef.current || pointerOriginRef.current === null) {
            return;
        }

        const deltaX = Math.abs(event.clientX - pointerOriginRef.current.x);
        const deltaY = Math.abs(event.clientY - pointerOriginRef.current.y);

        if (deltaX >= TOUCH_MOVE_CANCEL_THRESHOLD_PX || deltaY >= TOUCH_MOVE_CANCEL_THRESHOLD_PX) {
            pointerMovedRef.current = true;
            cancelPendingActivation();
            ignoreClickRef.current = true;
            scheduleClickReset();
        }
    }, [cancelPendingActivation, scheduleClickReset]);

    const handlePointerLeave = useCallback(() => {
        stopPress(false);
    }, [stopPress]);

    const handlePointerCancel = useCallback(() => {
        stopPress(true);
    }, [stopPress]);

    const handleBlur = useCallback((event: ReactFocusEvent<HTMLButtonElement>) => {
        if (event.relatedTarget === event.currentTarget) {
            return;
        }

        stopPress(ignoreClickRef.current ? false : true);
    }, [stopPress]);

    const handleClick = useCallback(() => {
        if (ignoreClickRef.current) {
            ignoreClickRef.current = false;
            return;
        }

        changeFn();
    }, [changeFn]);

    return {
        onClick: handleClick,
        onPointerDown: handlePointerDown,
        onPointerUp: handlePointerUp,
        onPointerMove: handlePointerMove,
        onPointerLeave: handlePointerLeave,
        onPointerCancel: handlePointerCancel,
        onBlur: handleBlur,
    };
}

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
    const valueRef = useRef(value);

    useEffect(() => {
        valueRef.current = value;
    }, [value]);

    const changeValue = useCallback((delta: number) => {
        const currentValue = valueRef.current;
        let nextValue = currentValue + delta;

        if (step - Math.trunc(step) !== 0) {
            nextValue = Number(nextValue.toFixed(1));
        }

        if (min !== undefined) {
            nextValue = Math.max(nextValue, min);
        }
        if (max !== undefined) {
            nextValue = Math.min(nextValue, max);
        }

        valueRef.current = nextValue;
        onChange(nextValue);
    }, [min, max, onChange, step]);

    const decreaseHandler = useCallback(() => {
        changeValue(-step);
    }, [changeValue, step]);

    const increaseHandler = useCallback(() => {
        changeValue(step);
    }, [changeValue, step]);

    const decreaseHandlers = useRepeatPress(decreaseHandler);
    const increaseHandlers = useRepeatPress(increaseHandler);

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
                    onClick={decreaseHandlers.onClick}
                    onPointerDown={decreaseHandlers.onPointerDown}
                    onPointerUp={decreaseHandlers.onPointerUp}
                    onPointerMove={decreaseHandlers.onPointerMove}
                    onPointerLeave={decreaseHandlers.onPointerLeave}
                    onPointerCancel={decreaseHandlers.onPointerCancel}
                    onBlur={decreaseHandlers.onBlur}
                >
                    <RemoveIcon />
                </Button>
                <Button
                    disabled={value === max}
                    sx={{ pl: 0, pr: 0 }}
                    onClick={increaseHandlers.onClick}
                    onPointerDown={increaseHandlers.onPointerDown}
                    onPointerUp={increaseHandlers.onPointerUp}
                    onPointerMove={increaseHandlers.onPointerMove}
                    onPointerLeave={increaseHandlers.onPointerLeave}
                    onPointerCancel={increaseHandlers.onPointerCancel}
                    onBlur={increaseHandlers.onBlur}
                >
                    <AddIcon />
                </Button>
            </ButtonGroup>
        </Box>
    );
}
