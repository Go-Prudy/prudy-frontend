'use client';

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { Chart, ChartOptions, Plugin } from 'chart.js';

// Define a custom plugin for drawing text in the middle of the chart
const textCenterPlugin: Plugin<'doughnut'> = {
    id: 'textCenter',
    beforeDraw: (chart) => {
        const { ctx, width, height } = chart;

        ctx.save();

        // Center both texts vertically and horizontally
        const centerX = width / 2;
        const centerY = height / 2;

        // Apply styles for the main text
        ctx.font = '400 13.46px Aeonik';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#575757'; // Use black as default color
        const text = 'Total budget';

        // Draw the main text at the center
        ctx.fillText(text, centerX, centerY - 10);

        // Apply styles for the subtext
        ctx.font = '700 18.85px Aeonik';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#2D2D2D'; // Apply Greyscale-Text-Subtitle color
        const subtext = '₦ 25,000,000';

        // Draw the subtext below the main text, with some vertical spacing
        ctx.fillText(subtext, centerX, centerY + 20);

        ctx.restore();
    },
};

interface BudgetCategory {
    name: string;
    percentage: number;
    color: string;
}

interface BudgetChartProps {
    budgetCategories: BudgetCategory[];
}

const BudgetChart: React.FC<BudgetChartProps> = ({ budgetCategories }) => {
    const data = {
        labels: budgetCategories.map(category => category.name),
        datasets: [
            {
                data: budgetCategories.map(category => category.percentage),
                backgroundColor: budgetCategories.map(category => category.color),
                borderColor: '#fff',
                borderWidth: 5,
                cutout: '80%', // This creates the hole in the middle
            },
        ],
    };

    const options: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            tooltip: {
                enabled: false, // Disable tooltips
            },
            legend: {
                display: false, // Hide the legend
            },
        },
    };

    return (
        <div className="w-48 h-48">
            <Doughnut data={data} options={options} plugins={[textCenterPlugin]} />
        </div>
    );
};

export default BudgetChart;
