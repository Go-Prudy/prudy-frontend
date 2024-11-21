'use client';

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { Chart, ChartOptions, Plugin } from 'chart.js';

// Define a custom plugin for drawing text in the middle of the chart
// Define a custom plugin for drawing text in the middle of the chart
const textCenterPlugin = (totalBudget: number): Plugin<'doughnut'> => ({
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
        ctx.fillStyle = '#575757'; // Use grey color for the main text
        const text = 'Total budget';

        // Draw the main text at the center
        ctx.fillText(text, centerX, centerY - 15); // Adjust vertical position to center it

        // Apply styles for the subtext (total budget amount)
        ctx.font = '700 18.85px Aeonik';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#2D2D2D'; // Apply darker color for the subtext
        const subtext = `₦ ${totalBudget.toLocaleString()}`;

        // Draw the subtext slightly below the main text, with better spacing
        ctx.fillText(subtext, centerX, centerY + 15); // Adjust vertical position for better alignment

        ctx.restore();
    },
});


interface BudgetCategory {
    name: string;
    percentage: number;
    color: string;
}


interface BudgetChartProps {
    budgetCategories: BudgetCategory[];
    totalBudget: number;
}


const BudgetChart: React.FC<BudgetChartProps> = ({ budgetCategories, totalBudget }) => {

    // Function to generate random hex color
    const generateRandomColor = (): string => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    // Default color when totalBudget is 0
    const defaultColor = "#b0b0b0"; // A grey color or any color of your choice

    // If totalBudget is 0, use a single default color
    const updatedCategories = totalBudget === 0
        ? [{ name: "No Budget", percentage: 100, color: defaultColor }]
        : budgetCategories.map((item, index) => ({
            ...item,
            color: generateRandomColor(), // Assign random colors dynamically
        }));

    console.log(budgetCategories.map(category => category.name));
    console.log(budgetCategories.map(category => category.percentage));

    const data = {
        labels: budgetCategories.map(category => category.name),
        datasets: [
            {
                data: budgetCategories.map(category => category.percentage),
                backgroundColor: budgetCategories.map(category => category.color),
                borderColor: '#fff',
                borderWidth: 5,
                hoverOffset: 4,
                cutout: '80%',
                elements: {
                    arc: {
                        angle: 160,
                        circular: true, // Ensure arcs are curved
                        borderAlign: 'round', // Align the border to the center of each arc
                        borderWidth: 30, // Border width of the arcs
                        borderJoinStyle: 'miter',

                    },
                },
            },
        ],
    };

    const options: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: true,

    };

    return (
        <div className="w-48 h-48">
            <Doughnut data={data} options={options} plugins={[textCenterPlugin(totalBudget)]} />
        </div>
    );
};

export default BudgetChart;
