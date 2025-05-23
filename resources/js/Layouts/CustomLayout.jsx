import ApplicationLogo from "@/Components/ApplicationLogo";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import ScrollRightAnimation from "@/Components/ScrollRightAnimation";
import ScrollDownAnimation from "@/Components/ScrollDownAnimation";
import { Link } from "@inertiajs/react";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

export default function CustomLayout({ header, links, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    return (
        <div className="min-h-screen bg-gray-100 z-50" >
            <nav className="bg-xavier-green border-b border-gray-100 sticky top-0">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                    <ScrollDownAnimation>
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="shrink-0 flex items-center">
                                    <Link href="/">
                                        <ApplicationLogo className="block w-12 fill-current text-gray-800" />
                                    </Link>
                                </div>

                                <div className="hidden space-x-8 md:-my-px md:ms-10 md:flex">
                                    {links.map(link => (
                                        <NavLink href={route('home', { election: link.id })} active={route().current('home', { election: link.id })} key={link.id}>
                                            {link.name}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>

                            <div className="-me-2 flex items-center md:hidden">
                                <button
                                    onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                                >
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        <path
                                            className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </ScrollDownAnimation>
                </div>
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' md:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        {links.map(link => (
                            <ResponsiveNavLink href={route('home', { election: link.id })} active={route().current('home', { election: link.id })} key={link.id}>
                                {link.name}
                            </ResponsiveNavLink>
                        ))}

                    </div>
                </div>
            </nav>

            {header && (
                <ScrollRightAnimation>
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">{header}</div>
                    </header>
                </ScrollRightAnimation>
            )}
            <Toaster position="top-right" reverseOrder={false} />
            <main>{children}</main>
        </div>
    )
}