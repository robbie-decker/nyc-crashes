import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";


import { DQM_Data } from '../data/DQM_Data';

import * as d3 from "d3";
import { NumberSymbol } from '@angular/common';
@Component({
  selector: 'app-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.scss']
})
export class ScatterPlotComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.makeChart("anomalies");
  }

  selectedValue: string = 'anomalies'; // Default value
  onValueChange() {
    this.makeChart(this.selectedValue);
  }

  makeChart(theme: string){
    console.log(DQM_Data.length)

    // Need to fetch our data
    
    const width = 600;
    const height = 400;
    const margin = {top: 20, right: 30, bottom: 30, left: 40};
    
    const svg = d3.select("#scatter_plot").append('svg')
                  .attr("width", width)
                  .attr("height", height);
    
    interface dqm_scatter_data{
      x: number;
      y: number;
    }

    const data: dqm_scatter_data[] = DQM_Data.map((d:any) => ({
        x: d.volume,
        y: d.kpi_zscore,
    }));

    
    const xScale = d3.scaleLinear().domain([0, 10000]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([-5, 5]).range([height - margin.bottom, margin.top]);

    const upperBound = 2;
    const lowerBound = -2;

    const xAxis = d3.axisBottom(xScale)
        .tickSize(-(height - margin.bottom - margin.top))
        .tickFormat(d3.format(""))
        .tickSizeOuter(0)

    const yAxis = d3.axisLeft(yScale)
        .tickSizeInner(-(width - margin.left - margin.right))
        .tickSizeOuter(0)
        .tickFormat(d3.format(""))

    // X axis that goes across at y = 0 
    svg.append("g")
        .attr("transform", `translate(0,${yScale(0)})`)
        .attr("class", "grid")
        .attr("stroke", "lightgray")
        .call(xAxis)
        // Change color of Axis
        .select(".domain")
        .attr("stroke", "lightgray");

    svg.selectAll(".tick line")
        // .attr("stroke-width", "10px")
        .attr("transform", `translate(0,${(height - margin.bottom - margin.top)/2})`);
    
    // Y axis
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .attr("class", "grid")
        .attr("stroke", "lightgray")
        .call(yAxis)
        // Change color of Axis
        .select(".domain")
        .attr("stroke", "lightgray");


    d3.selectAll(".grid line")
        .attr("stroke", "lightgray")
        .attr("stroke-dasharray", "4,4"); // Dotted grid lines

        const tooltip = d3.select("#scatter_plot")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("position", "absolute") // Absolute positioning to follow the cursor
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")



    // Here are the data points
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", (d) => {
            if (d.y > upperBound || d.y < lowerBound){
                return "anamoly";
            }
            else{
                return "normal";
            }
        })
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 6)
        .on("mouseover", function() {
          // this.;
            tooltip.style("opacity", 1);
        })  
        .on("mousemove", showToolTip)
        .on("mouseout", hideToolTip)

    function showToolTip(event:any, d:any){
      console.log(d);
        tooltip
            .html(`Volume: ${d.x}<br>Z-Score: ${d.y} `)
            .style("left", (event.pageX)+ 10 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", (event.pageY)+ 10 + "px")
    }
    function hideToolTip(event:any, d:any){
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }
  }
}
