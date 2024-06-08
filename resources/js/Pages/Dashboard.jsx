import React, { useEffect, useState } from 'react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
    Title
} from "chart.js";
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
    Title
);

export default function Dashboard({ auth, initialData }) {
    const [data, setData] = useState(initialData);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/dashboard/data');
            const newData = await response.json();
            setData(newData);
        };

        fetchData(); // Initial fetch
        const intervalId = setInterval(fetchData, 1000); // Fetch every second

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    const createChartData = (position) => {
        const labels = position.candidates.map(candidate => candidate.name);
        const data = position.candidates.map(candidate => candidate.votes_count);

        return {
            labels,
            datasets: [
                {
                    label: 'Votes',
                    data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        };
    };

    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <div className='flex items-center overflow-hidden'>
                                    <span className='p-4 bg-green-400 text-gray-100 w-16 text-center'>
                                        <i className="fa-solid fa-xl fa-square-poll-vertical"></i>
                                    </span>
                                    <div className='px-4 text-gray-700'>
                                        <h3 className="text-sm font-semibold tracking-wider text-nowrap text-gray-500">
                                            Active Election
                                        </h3>
                                        <p className='text-3xl text-gray-700'>
                                            <span>
                                                {data.totalActiveElections}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <div className='flex items-center overflow-hidden'>
                                    <span className='p-4 bg-green-400 text-gray-100 w-16 text-center'>
                                        <i className="fa-solid fa-xl fa-bars-progress fa-xl"></i>
                                    </span>
                                    <div className='px-4 text-gray-700'>
                                        <h3 className="text-sm font-semibold tracking-wider text-nowrap text-gray-500">
                                            Active Position
                                        </h3>
                                        <p className='text-3xl text-gray-700'>
                                            <span>
                                                {data.totalActivePosition}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <div className='flex items-center overflow-hidden'>
                                    <span className='p-4 bg-green-400 text-gray-100 w-16 text-center'>
                                        <i className="fa-solid fa-xl fa-user-tie"></i>
                                    </span>
                                    <div className='px-4 text-gray-700'>
                                        <h3 className="text-sm font-semibold tracking-wider text-nowrap text-gray-500">
                                            Candidates
                                        </h3>
                                        <p className='text-3xl text-gray-700'>
                                            <span>
                                                {data.totalCandidates}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <div className='flex items-center overflow-hidden'>
                                    <span className='p-4 bg-green-400 text-gray-100 w-16 text-center'>
                                        <i className="fa-solid fa-xl fa-users"></i>
                                    </span>
                                    <div className='px-4 text-gray-700'>
                                        <h3 className="text-sm font-semibold tracking-wider text-nowrap text-gray-500">
                                            Members
                                        </h3>
                                        <p className='text-3xl text-gray-700'>
                                            <span>
                                                {data.totalMembers}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {data.elections.map(election => (
                                <div key={election.id} className="mb-8">
                                    <h2 className="text-2xl font-semibold mb-6">{election.name}</h2>
                                    <div className='grid md:grid-cols-2 grid-cols-1 gap-8'>
                                        {election.positions.map(position => (
                                            <div key={position.id} className="mb-8 ">
                                                <h3 className="text-lg font-semibold mb-4">{position.name}</h3>
                                                <Bar data={createChartData(position)} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
