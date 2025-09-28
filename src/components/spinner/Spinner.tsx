interface Props {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
    color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'error',
    blocker?: boolean,
    class?: string,
    containerClass?: string,
}

export function Spinner(props: Props) {
    return (
        <div
            class={props.class}
            classList={{
                'inline-block align-middle': !props.blocker,
                'absolute left-0 top-0 right-0 bottom-0 w-full h-full flex items-center justify-center z-99': props.blocker,
            }}
        >
            <div
                class="loading loading-spinner"
                classList={{
                    'w-[10px]': props.size === 'xs',
                    'w-[20px]': props.size === 'sm',
                    'w-[30px]': props.size === 'md',
                    'w-[40px]': props.size === 'lg',
                    'w-[50px]': props.size === 'xl',
                    'text-primary': props.color === 'primary',
                    'text-secondary': props.color === 'secondary',
                    'text-accent': props.color === 'accent',
                    'text-neutral': props.color === 'neutral',
                    'text-info': props.color === 'info',
                    'text-success': props.color === 'success',
                    'text-warning': props.color === 'warning',
                    'text-error': props.color === 'error',
                }}
            />
        </div>
    );
}