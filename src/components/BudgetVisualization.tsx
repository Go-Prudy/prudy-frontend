import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { BudgetDistributionCategory } from '@/app/types/budget';

interface BudgetVisualizationProps {
  totalBudget: number;
  distributions: BudgetDistributionCategory[];
}

const BudgetVisualization: React.FC<BudgetVisualizationProps> = ({
  totalBudget,
  distributions,
}) => {
  useEffect(() => {
    const width = 280;
    const height = 280;
    const radius = Math.min(width, height) / 2;

    const arcGenerator = d3
      .arc<any>()
      .innerRadius(radius - 60)
      .outerRadius(radius - 40)
      .padAngle(0)
      .cornerRadius(6);

    const pieGenerator = d3.pie<BudgetDistributionCategory>().value((d) => d.percentage);

    const pieData = pieGenerator(distributions);

    d3.select('#budget-chart').select('svg').remove();

    const svg = d3
      .select('#budget-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const tooltip = d3
      .select('#budget-chart')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('border', '1px solid #ddd')
      .style('border-radius', '15px')
      .style('padding', '5px 10px')
      .style('font-size', '14px')
      .style('box-shadow', '0px 2px 5px rgba(0,0,0,0.1)')
      .style('pointer-events', 'none');

    svg
      .selectAll('path')
      .data(pieData)
      .enter()
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', (d) => d.data.color)
      .attr('stroke', '#F7F7F9')
      .attr('stroke-width', 3)
      .on('mouseover', (event, d) => {
        const arcCentroid = arcGenerator.centroid(d);
        const tooltipWidth = 150;
        const tooltipHeight = 50;

        const tooltipX = arcCentroid[0] + 5;
        const tooltipY = arcCentroid[1] - 5;

        const isLeftSide = arcCentroid[0] < window.innerWidth / 2;

        tooltip
          .style('visibility', 'visible')
          .html(`<strong>${d.data.name}</strong><br>${d.data.percentage}% of Total`)
          .style('top', `${isLeftSide ? tooltipY : arcCentroid[1] + 10}px`)
          .style(
            'left',
            `${isLeftSide ? tooltipX : arcCentroid[0] - tooltipWidth - 5}px`,
          );

        tooltip.select('.arrow').remove();
        tooltip
          .append('div')
          .attr('class', 'arrow')
          .style('position', 'absolute')
          .style('width', '0')
          .style('height', '0')
          .style('border-left', '5px solid transparent')
          .style('border-right', '5px solid transparent')
          .style('border-bottom', isLeftSide ? '5px solid white' : '5px solid white')
          .style('top', isLeftSide ? `${tooltipY + 5}px` : `${arcCentroid[1] + 5}px`)
          .style(
            'left',
            isLeftSide
              ? `${tooltipX + tooltipWidth / 2 - 5}px`
              : `${arcCentroid[0] - tooltipWidth - 10}px`,
          );

        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('transform', 'scale(1.05)');
      })
      .on('mousemove', (event, d) => {
        const arcCentroid = arcGenerator.centroid(d);
        const tooltipWidth = 150;

        const tooltipX = arcCentroid[0] + 5;
        const tooltipY = arcCentroid[1] - 5;

        const isLeftSide = arcCentroid[0] < window.innerWidth / 2;

        tooltip
          .style('top', `${isLeftSide ? tooltipY : arcCentroid[1] + 10}px`)
          .style(
            'left',
            `${isLeftSide ? tooltipX : arcCentroid[0] - tooltipWidth - 5}px`,
          );

        tooltip.select('.arrow').remove();
        tooltip
          .append('div')
          .attr('class', 'arrow')
          .style('position', 'absolute')
          .style('width', '0')
          .style('height', '0')
          .style('border-left', '5px solid transparent')
          .style('border-right', '5px solid transparent')
          .style('border-bottom', isLeftSide ? '5px solid white' : '5px solid white')
          .style('top', isLeftSide ? `${tooltipY + 5}px` : `${arcCentroid[1] + 5}px`)
          .style(
            'left',
            isLeftSide
              ? `${tooltipX + tooltipWidth / 2 - 5}px`
              : `${arcCentroid[0] - tooltipWidth - 10}px`,
          );
      })
      .on('mouseout', (event) => {
        tooltip.style('visibility', 'hidden');
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('transform', 'scale(1)');
      });

    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 15)
      .style('font-size', '18.85px')
      .style('font-weight', '700')
      .style('fill', '#333')
      .text(`₦ ${totalBudget?.toLocaleString()}`);

    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -10)
      .style('font-size', '13.6px')
      .style('fill', '#575757')
      .text('Total budget');

    return () => {
      d3.select('#budget-chart .tooltip').remove(); // Cleanup on unmount
    };
  }, [distributions, totalBudget]);

  return (
    <div className="flex flex-col items-center">
      <div id="budget-chart" className="relative"></div>
    </div>
  );
};

export default BudgetVisualization;
