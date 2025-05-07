import { Pie, Bar } from 'react-chartjs-2';

function ChartComponent({ type, data, title }) {
    return (
        <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            {type === 'pie' && <Pie data={data} />}
            {type === 'bar' && <Bar data={data} />}
        </div>
    );
}

export default ChartComponent;
