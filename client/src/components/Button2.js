// Button.jsx
import clsx from 'clsx'

const Button2 = ({
    children,
    type = 'button',
    className,
    fw,
    onClick,
    ...rest
}) => {
    return (
        <button
            type={type}
            className={className ? className : clsx(
                'px-4 py-2 rounded-md text-white bg-main text-semibold my-2',
                fw ? 'w-full' : 'w-fit'
            )}
            onClick={onClick}
            {...rest}
        >
            {children}
        </button>
    )
}

export default Button2
