import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInputData(
    { type = 'text', className = '', isFocused = false, data = [], ...props },
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, [isFocused]);

    const dataListId = `${props.id || 'input'}-list`;

    return (
        <>
            <input
                {...props}
                type={type}
                list={dataListId}
                className={
                    'border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-md shadow-sm ' +
                    className
                }
                ref={input}
            />
            <datalist id={dataListId}>
                {data.map((item, index) => (
                    <option key={index} value={item} />
                ))}
            </datalist>
        </>
    );
});
