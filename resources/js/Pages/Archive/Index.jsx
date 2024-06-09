import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Index({ auth, elections }) {
    // Separate active and inactive elections
    const activeElections = elections.filter(election => election.is_active === 1);
    const inactiveElections = elections.filter(election => election.is_active === 0);
    const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };

    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Archive</h2>}
        >
            <Head title="Archive" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <h3 className="font-semibold text-lg text-gray-800 leading-tight">On Going Elections</h3>
                    {activeElections.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {activeElections.map(election => (
                                <Link href={route('archive.show', election.id)}>
                                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold tracking-wider text-gray-800">{election.name}</h3>
                                            <p className="text-sm mt-2 text-nowrap text-gray-500">{new Date(election.start_date).toLocaleDateString("en-US", options)}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <p>No active elections.</p>
                            </div>
                        </div>
                    )}
                    <h3 className="font-semibold text-lg text-gray-800 leading-tight">Archive Elections</h3>
                    {inactiveElections.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {inactiveElections.map(election => (
                                <Link href={route('archive.show', election.id)}>
                                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold tracking-wider text-gray-800">{election.name}</h3>
                                            <p className="text-sm mt-2 text-nowrap text-gray-500">{new Date(election.start_date).toLocaleDateString("en-US", options)}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <p>No in active elections.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
