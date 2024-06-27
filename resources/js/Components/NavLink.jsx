import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-blue-400 text-gray-50 focus:border-blue-400 '
                    : 'border-transparent text-gray-200 hover:text-gray-50 hover:border-blue-300 focus:text-gray-50 focus:border-blue-300 ') +
                className
            }
        >
            {children}
        </Link>
    );
}
