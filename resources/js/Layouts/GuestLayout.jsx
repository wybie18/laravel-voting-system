import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 sfxc-bg-image">
            <div className='z-10'>
                <Link href="/">
                    <ApplicationLogo className="w-40 object-cover" />
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-[-5rem] px-6 pt-24 pb-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
