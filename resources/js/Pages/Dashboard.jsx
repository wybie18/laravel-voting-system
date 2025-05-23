import React, { useEffect, useState, useRef } from 'react';
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
import PrintComponent from '@/Components/PrintComponent';
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

        fetchData();
        const intervalId = setInterval(fetchData, 1500);

        return () => clearInterval(intervalId);
    }, []);

    const createChartData = (position) => {
        const labels = position.candidates.map(candidate => candidate.name);
        const data = position.candidates.map(candidate => candidate.votes_count);

        const borderColors = [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ];

        return {
            labels,
            datasets: [
                {
                    label: 'Vote Count',
                    data,
                    backgroundColor: 'rgba(74, 222, 128, 0.5)',
                    borderColor: borderColors.slice(0, data.length),
                    borderWidth: 1,
                },
            ],
        };
    };

    const chartOptions = (name) => {
        return {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                },
                title: {
                    display: true,
                    text: name,
                    font: {
                        size: 20
                    },
                    position: "top"
                },
            },
            scales: {
                y: {
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1,
                    },
                },
            },
        };
    };

    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <div className='flex items-center overflow-hidden'>
                                    <span className='p-4 bg-green-700 text-gray-100 w-16 text-center'>
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
                                    <span className='p-4 bg-green-700 text-gray-100 w-16 text-center'>
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
                                    <span className='p-4 bg-green-700 text-gray-100 w-16 text-center'>
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
                                    <span className='p-4 bg-green-700 text-gray-100 w-16 text-center'>
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
                    {data.elections.length > 0 ? (
                        data.elections.map(election => (
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg" key={election.id}>
                                <div className="p-6 text-gray-900">
                                    <div className="mb-8">
                                        <div className="overflow-auto">
                                            <div className="print-header text-center">
                                                <img className="mx-auto w-32 object-cover" src="/logo.png" alt="logo" />
                                                <img className="mx-auto w-72 object-cover" src="/xavier_name.png" alt="logo" />
                                            </div>
                                            <PrintComponent>
                                                <div className='flex justify-between items-center mb-6'>
                                                    <div className='flex items-center justify-center gap-2'>
                                                        {election.image_url && (
                                                            <img src={'/storage/' + election.image_url} alt="logo" className="w-12 h-12 object-cover" />
                                                        )}
                                                        <h2 className="text-2xl font-semibold">{election.name}</h2>
                                                    </div>
                                                    <span className='on-print bg-green-900 py-1 px-3 me-2 text-white rounded shadow transition-all hover:bg-green-700 float-end'
                                                        title='Vote Count'
                                                    >
                                                        <span className='text-gray-100 text-nowrap'>{data.votersVote.voted} / {data.votersVote.voters}</span>
                                                    </span>
                                                </div>
                                                <table className="table-auto min-w-full mb-4 border-collapse border-gray-200">
                                                    <thead className="text-md text-gray-700 uppercase bg-gray-50 border-b-2 border-gray-500">
                                                        <tr>
                                                            <th className="px-4 py-2 text-left">Position</th>
                                                            <th className="px-4 py-2 text-left">Candidate</th>
                                                            <th className="px-4 py-2 w-40">Vote Count</th>
                                                            <th className="px-4 py-2 w-32">Rank</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {election.positions.map(position => {
                                                            const sortedCandidates = [...position.candidates].sort((a, b) => b.votes_count - a.votes_count);
                                                            return sortedCandidates.map((candidate, index) => {
                                                                let bgColor = '';
                                                                if (index === 0) bgColor = 'bg-green-400'; // 1st place
                                                                return (
                                                                    <tr key={candidate.id}>
                                                                        {index === 0 && (
                                                                            <td className="px-4 py-2 border-b border-r font-medium" rowSpan={sortedCandidates.length}>
                                                                                {position.name}
                                                                            </td>
                                                                        )}
                                                                        <td className="px-4 py-2 border-b">{candidate.name}</td>
                                                                        <td className="px-4 py-2 border-b text-center">{candidate.votes_count}</td>
                                                                        <td className={"px-4 py-2 border-b text-center " + (candidate.votes_count !== 0 ? bgColor : '')}>
                                                                            {candidate.votes_count !== 0 ? index + 1 : "0"}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            });
                                                        })}
                                                    </tbody>
                                                </table>
                                            </PrintComponent>
                                        </div>
                                        <div className='grid lg:grid-cols-2 grid-cols-1 gap-8 mt-8'>
                                            {election.positions.map(position => (
                                                <div key={position.id} className="mb-8">
                                                    <Bar data={createChartData(position)} options={chartOptions(position.name)} className='border py-1 px-2' />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : <h2 className='text-center mt-4 text-lg text-gray-700'>There are currently no active elections.</h2>}
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
