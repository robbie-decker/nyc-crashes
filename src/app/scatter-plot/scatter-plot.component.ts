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

  tooltip:any;
  tooltipType:any;
  mytooltipData:any;
  dataTurn:any;
  height:any;


  constructor() {
    
   }

  ngOnInit(): void {
    this.makeChart();
  }

  upperBound = 2;
  lowerBound = -2;


  selectedValue: string = 'anomalies'; // Default value
  onValueChange() {
    this.changeChartTheme(this.selectedValue);
  }

  changeChartTheme(theme: string){
    if (theme === "anomalies"){
      this.current_theme = theme;
      d3.selectAll("circle")
      // Remove all classes
      .attr("class", null)
      // Remove all styles
      .attr("style", null)
      .attr("style", (d:any) => {
        if (d.y > this.upperBound || d.y < this.lowerBound){
            return `fill: #e86e54; 
                    fill-opacity: 0.5;
                    stroke: #e86e54; 
                    stroke-width: 1px;`; 
        }
        else{
            return `fill: #2dc887; 
                    fill-opacity: 0.5;
                    stroke: #2dc887; 
                    stroke-width: 1px; `;
        }
      });
    }
    else{
      d3.selectAll("circle")
      // Remove all classes
      .attr("class", null)
      // Remove all styles
      .attr("style", null)
      .attr("style", (d:any) => {
        if (theme === "sources"){
          // d.current_color = this.known_source_colors[d.source_name];
          this.current_theme = theme;
          return `fill: ${this.known_source_colors[d.source_name] || "gray"}`;
        }
        if (theme === "kpi"){
          // d.current_color = this.known_kpi_colors[d.kpi_name];
          this.current_theme = theme;
          return `fill: ${this.known_kpi_colors[d.kpi_name] || "gray"}`;
        }
        else{
          return ``
        }
      })
    }
  }
  current_theme = this.selectedValue;
  known_source_colors: Record<string, string> = {}; // Maps source_name to color
  known_kpi_colors: Record<string, string> = {}; // Maps kpi_name to color

  darkColors: string[] = ["#E74028", "#2CB239", "#25D3EB", "#FFB039", "#1566DE", "#7848FF", "#7AD045", "#CB04DC", "#FA195C", "#9E0000", "#EACD37", "#DD630B", "#BCD03F", "#14BDA9", "#8A05F3", "#D9476A", "#2DADB6", "#E468C2", "#199CD4", "#0934CC",
          "#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6",
          "#1abc9c", "#34495e", "#e67e22", "#16a085", "#d35400",
          "#2980b9", "#8e44ad", "#c0392b", "#27ae60", "#f39c12",
          "#7f8c8d", "#e74c3c", "#3498db", "#2ecc71", "#f1c40f",
          "#9b59b6", "#1abc9c", "#34495e", "#e67e22", "#16a085",
          "#d35400", "#2980b9", "#8e44ad", "#c0392b", "#27ae60",
          "#f39c12", "#7f8c8d", "#e74c3c", "#3498db", "#2ecc71",
          "#f1c40f", "#9b59b6", "#1abc9c", "#34495e", "#e67e22",
          "#16a085", "#d35400", "#2980b9", "#8e44ad", "#c0392b",
          "#27ae60", "#f39c12", "#7f8c8d", ...this.getRandomColor(50)];


  makeChart(){
    // const myChart = this;
    // const myClass = myChart.divId;

    this.known_source_colors = {} as Record<string, string>;
    this.known_kpi_colors = {} as Record<string, string>;

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
      source_name: string;
      kpi_name: string;
      current_color?: string;
    }

    const data: dqm_scatter_data[] = DQM_Data.map((d:any) => ({
        x: d.volume,
        y: d.kpi_zscore,
        source_name: d.source_name,
        kpi_name: d.kpi_name
    }));

    data.forEach((d:any, index:number) => {
      // If kpi color not set then set the color
      if (!this.known_source_colors[d.source_name]) {
        this.known_source_colors[d.source_name] = this.darkColors[index % this.darkColors.length];
      }
      // If source color not set then set the color
      if (!this.known_kpi_colors[d.kpi_name]) {
        this.known_kpi_colors[d.kpi_name] = this.darkColors[(index) % this.darkColors.length];
      }
    });
    
    const xScale = d3.scaleLinear().domain([0, 10000]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([-5, 5]).range([height - margin.bottom, margin.top]);

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
    const circles = svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 6)
        .on("mouseover", (event:any, d: any) => {
          // if(myChart.props.navArrow){
          // d3.select(event.currentTarget).attr("fill", '#1363DF');}
          // if(getGroupLabel(d).includes("..")){
          this.showTooltip('groupFullName', d, event.offsetX, event.offsetY, width, height);
          // }
        }) 
        .on("mousemove", (event: any, d: any) => {
          const tooltipData: any = [];
          tooltipData.push({
            x: d.volume,
            y: d.kpi_zscore,
            source_name: d.source_name,
            kpi_name: d.kpi_name,
            fill: "black"
          });
          // this.showTooltip('groupHBar', tooltipData, event.offsetX, event.offsetY, width, height);
          this.showTooltip('groupHBar', d, event.offsetX, event.offsetY, width, height);
        })
        .on("mouseout", (event:any) => {
              // if(myChart.props.navArrow){
                d3.select(event.currentTarget).attr("fill", "#101D42");
              // }
              this.hideTooltip("groupFullName");
            });

        // Set theme
        this.changeChartTheme(this.selectedValue);

    // Lasso stuff
    const lassoLayer = svg.append("g").attr("class", "lasso-layer");
          
    let lassoPoints: [number, number][] = [];
    let isDragging = false;

    const lasso = d3.drag()
      .on("start", (event) => {
        this.changeChartTheme(this.current_theme);
        lassoPoints = []; // Reset previous lasso selection
        isDragging = true;
        lassoLayer.selectAll("path").remove(); // Clear old lasso
        // remove highlights of selected points
        // selectPointsInsideLasso([]) 
      })
      .on("drag", (event) => {
        if (!isDragging) return;

        const [x, y] = d3.pointer(event, svg.node());
        lassoPoints.push([x, y]);

        lassoLayer.selectAll("path").remove();
        lassoLayer.append("path")
          .attr("d", `M${lassoPoints.map(d => d.join(",")).join("L")}Z`)
          .attr("fill", "rgba(0,0,255,0.1)")
          .attr("stroke", "blue")
          .attr("stroke-width", 1);
      })
      .on("end", () => {
        isDragging = false;
        if (lassoPoints.length > 2) {
          selectPointsInsideLasso(lassoPoints);
        }
      });

      svg.call(lasso as unknown as (selection: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>) => void);

    // Change the stylings of selected points
    function selectPointsInsideLasso(lassoPolygon: [number, number][]) {
      d3.selectAll("circle").each(function(d: any) {
        const [cx, cy] = [xScale(d.x), yScale(d.y)];
        const isInside = d3.polygonContains(lassoPolygon, [cx, cy]);

        if (isInside){
          d3.select(this)
            .attr("style", "fill: black;")
        }
      });
    }
  }
  private showTooltip(myType: any, myData: any, myX: any, myY: any, chartWidth: any, chartHeight:any): void {
    this.tooltipType=myType
    this.mytooltipData = this.tooltipType=='groupHBar'? myData:myData
    this.dataTurn = 0;
    this.height = 0;
    this.dataTurn = chartWidth - myX
    this.height = chartHeight - myY
    

    if (this.height < 200) {
      d3.select("#d3WordCloudTooltip")
        .style('visibility', 'visible')
        .style('position', 'absolute')
        .style('bottom', (this.height - 60) + 'px')
        .style('top', 'unset')
    }
    else if (this.height > 200) {

      d3.select("#d3WordCloudTooltip")
        .style('visibility', 'visible')
        .style('position', 'absolute')
        .style('top', (myY - 20) + 'px')
        .style('bottom', 'unset')
    }

    if (this.dataTurn < 250) {
      d3.select("#d3WordCloudTooltip")
        .style('visibility', 'visible')
        .style('position', 'absolute')
        // .style('top', myY + 40 + 'px')
        .style('right', (this.dataTurn + 20) + 'px')
        .style('left', 'unset')
        // .style('bottom', 'unset')
    }
    else if (this.dataTurn > 250) {

      d3.select("#d3WordCloudTooltip")
        .style('visibility', 'visible')
        .style('position', 'absolute')
        // .style('top', (  myY + 40) + 'px')
        .style('left', (myX+30) + 'px')
        .style('right', 'unset')
        // .style('bottom', 'unset')
    }
    this.tooltip=true;
  }

  private hideTooltip(myType: any): void {
    this.tooltip = false;
    d3.select("#d3WordCloudTooltip") 
      .style('visibility', 'hidden');
  }

  getRandomColor(count: any) {
    let shades: any = [];
    for (let i = 0; i < count; i++) {
      var length = 6;
      var chars = '0123456789ABCDEF';
      var hex = '#';
      while (length--) hex += chars[(Math.random() * 16) | 0];
      const shade = hex;
      shades.push(shade);
    }
    return shades;
  }
}

