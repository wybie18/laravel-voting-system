import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function Textarea({ className = '', children, ...props }, ref) {
    const input = ref ? ref : useRef();

    return (
        <textarea
            {...props}
            className={
                'border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-md shadow-sm ' +
                className
            }
            ref={input}
        >
            {children}
        </textarea>
    );
});
