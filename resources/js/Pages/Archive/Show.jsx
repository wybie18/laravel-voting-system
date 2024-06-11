import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
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
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import plugin from '@tailwindcss/forms';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
    Title
);

export default function Show({ auth, election }) {
    const contentToPrint = useRef(null);

    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
        documentTitle: `SFXC - ${election.name}`,
        removeAfterPrint: true,
    });

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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Archive</h2>}
        >
            <Head title="Archive" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 space-x-2">
                            <Link href={route('archive.index')}><SecondaryButton> Go Back </SecondaryButton></Link>
                            <PrimaryButton onClick={handlePrint}>
                                <i className="fa-solid fa-print inline"></i><span className='ml-2'>Print</span>
                            </PrimaryButton>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg" ref={contentToPrint}>
                        <div className="p-6 text-gray-900">
                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold mb-6">{election.name}</h2>
                                <table className="min-w-full mb-4 border-collapse border border-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 border">Position</th>
                                            <th className="px-4 py-2 border">Candidate</th>
                                            <th className="px-4 py-2 border">Votes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {election.positions.map(position => {
                                            // Sort candidates by votes_count in descending order
                                            const sortedCandidates = [...position.candidates].sort((a, b) => b.votes_count - a.votes_count);
                                            return sortedCandidates.map((candidate, index) => {
                                                let bgColor = '';
                                                if (index === 0) bgColor = 'bg-green-400'; // 1st place

                                                return (
                                                    <tr key={candidate.id}>
                                                        {index === 0 && (
                                                            <td className="px-4 py-2 border" rowSpan={sortedCandidates.length}>
                                                                {position.name}
                                                            </td>
                                                        )}
                                                        <td className="px-4 py-2 border">{candidate.name}</td>
                                                        <td className={`px-4 py-2 border ${bgColor}`}>{candidate.votes_count}</td>
                                                    </tr>
                                                );
                                            });
                                        })}
                                    </tbody>
                                </table>
                                <div className='grid md:grid-cols-2 grid-cols-1 gap-8 mt-8'>
                                    {election.positions.map(position => (
                                        <div key={position.id} className="mb-8">
                                            <Bar data={createChartData(position)} options={chartOptions(position.name)} className='border py-1 px-2' />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
