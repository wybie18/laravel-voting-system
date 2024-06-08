import { Bar } from 'react-chartjs-2';

const MultipleBarChart = ({ position, candidates }) => {
    const data = {
        labels: candidates.map((candidate) => candidate.name),
        datasets: [
            {
                label: 'Number of Votes',
                data: candidates.map((candidate) => candidate.votes),
                backgroundColor: '#4CAF50',
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <h3 className="text-lg font-bold mb-2">{position}</h3>
            <Bar data={data} options={options} />
        </div>
    );
};

export default MultipleBarChart;