import { useRef, useEffect } from 'react';

export function useLast<T>(value: T): T | undefined {
    const ref = useRef<T>(undefined);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    // eslint-disable-next-line react-hooks/refs
    return ref.current;
}