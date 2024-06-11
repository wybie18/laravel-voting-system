import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-green-400 text-gray-50 focus:border-green-700 '
                    : 'border-transparent text-gray-200 hover:text-gray-50 hover:border-green-300 focus:text-gray-50 focus:border-green-300 ') +
                className
            }
        >
            {children}
        </Link>
    );
}
