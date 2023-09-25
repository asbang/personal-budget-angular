import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Chart } from 'chart.js';
import * as d3 from 'd3';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit, AfterViewInit {
  public dataSource = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#ffcd56',
          '#ff6384',
          '#36a2eb',
          '#fd6b19',
          '#7ae7c7',
          '#c589e8',
          '#7c3238',
          '#8d99ae',
        ],
      },
    ],
    labels: [],
  };

  constructor(private http: HttpClient) {}
  ngAfterViewInit(): void {
    this.createSvg();
    this.http.get('http://localhost:3000/budget').subscribe((res: any) => {
      //this.change(this.randomData(res.myBudget))
      this.drawChart(this.randomData(res.myBudget));
      for (var i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;
      }
      this.createChart();
    });
  }

  ngOnInit(): void {}

  createChart() {
    // var ctx = document.getElementById("myChart").getContext("2d");
    var ctx = document.getElementById('myChart') as HTMLCanvasElement;
    var myPieChart = new Chart(ctx, {
      type: 'pie',
      data: this.dataSource,
    });
  }

  private svg: any;
  private margin = 50;
  private width = 750;
  private height = 600;
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors =[];

  private drawChart(data): void {
    // Compute the position of each group on the pie:
    const pie = d3.pie<any>().value((d: any) => Number(d.value));
    this.createColors(data);
    // Build the pie chart
    this.svg
      .selectAll('pieces')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', d3.arc().innerRadius(0).outerRadius(this.radius))
      .attr('fill', (d: any, i: any) => this.colors[i])
      .attr('stroke', '#121926')
      .style('stroke-width', '1px');

    // Add labels
    const labelLocation = d3.arc().innerRadius(100).outerRadius(this.radius);

    this.svg
      .selectAll('pieces')
      .data(pie(data))
      .enter()
      .append('text')
      .text((d: any) => {
        return   d.data.label
      }
        )
      .attr(
        'transform',
        (d: any) => 'translate(' + labelLocation.centroid(d) + ')'
      )
      .style('text-anchor', 'middle')
      .style('font-size', 15);
  }
  private createSvg(): void {
    this.svg = d3
      .select('#d3Chart')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
      );
  }
  private createColors(data): void {
    var letters = '0123456789ABCDEF';
    this.colors = [];
    for (let index = 0; index < data.length; index++) {
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      this.colors.push(color);
    }
  }

  // private pie = d3
  //   .pie<any>()
  //   .sort(null)
  //   .value(function (d) {
  //     return d.value;
  //   });

  // private key = function (d) {
  //   return d.data.label;
  // };

  randomData(budgetData) {
    console.log(budgetData);
    // var labels = Object.entries(budgetData);
    return budgetData.map(function (data) {
      return { label: data.title, value: data.budget };
    });
  }

  // arc = d3
  //   .arc()
  //   .outerRadius(this.radius * 0.8)
  //   .innerRadius(this.radius * 0.4);

  // outerArc = d3
  //   .arc()
  //   .innerRadius(this.radius * 0.9)
  //   .outerRadius(this.radius * 0.9);

  // change(data) {
  //   /* ------- PIE SLICES -------*/

  //   var slice = this.svg
  //   .select(".slices")
  //   .selectAll("path.slice")
  //     .data(this.pie(data), this.key);

  //   slice
  //   .enter()
  //   .insert("path")
  //     .style('fill', (d) => {
  //       var letters = '0123456789ABCDEF';
  //       var color = '#';
  //       for (var i = 0; i < 6; i++) {
  //         color += letters[Math.floor(Math.random() * 16)];
  //       }
  //       return color;
  //     })
  //     .attr('class', 'slice');

  //   slice
  //     .transition()
  //     .duration(1000)
  //     .attrTween('d', function (d) {
  //       this._current = this._current || d;
  //       var interpolate = d3.interpolate(this._current, d);
  //       this._current = interpolate(0);
  //       return function (t) {
  //         return this.arc(interpolate(t));
  //       };
  //     });

  //   slice.exit().remove();

  //   /* ------- TEXT LABELS -------*/

  //   var text = this.svg
  //     .select('.labels')
  //     .selectAll('text')
  //     .data(this.pie(data), this.key);

  //   text
  //     .enter()
  //     .append('text')
  //     .attr('dy', '.35em')
  //     .text(function (d) {
  //       return d.data.label;
  //     });

  //   function midAngle(d) {
  //     return d.startAngle + (d.endAngle - d.startAngle) / 2;
  //   }

  //   text
  //     .transition()
  //     .duration(1000)
  //     .attrTween('transform', function (d) {
  //       this._current = this._current || d;
  //       var interpolate = d3.interpolate(this._current, d);
  //       this._current = interpolate(0);
  //       return function (t) {
  //         var d2 = interpolate(t);
  //         var outerArc = d3
  //           .arc()
  //           .innerRadius(this.radius * 0.9)
  //           .outerRadius(this.radius * 0.9);
  //         var pos = outerArc.centroid(d2);
  //         var width = 960,
  //           height = 450;
  //         var radius = Math.min(width, height) / 2;
  //         pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
  //         return 'translate(' + pos + ')';
  //       };
  //     })
  //     .styleTween('text-anchor', function (d) {
  //       this._current = this._current || d;
  //       var interpolate = d3.interpolate(this._current, d);
  //       this._current = interpolate(0);
  //       return function (t) {
  //         var d2 = interpolate(t);
  //         return midAngle(d2) < Math.PI ? 'start' : 'end';
  //       };
  //     });

  //   text.exit().remove();

  //   /* ------- SLICE TO TEXT POLYLINES -------*/

  //   var polyline = this.svg
  //     .select('.lines')
  //     .selectAll('polyline')
  //     .data(this.pie(data), this.key);

  //   polyline.enter().append('polyline');

  //   polyline
  //     .transition()
  //     .duration(1000)
  //     .attrTween('points', function (d) {
  //       this._current = this._current || d;
  //       var interpolate = d3.interpolate(this._current, d);
  //       this._current = interpolate(0);
  //       return function (t) {
  //         var d2 = interpolate(t);
  //         var outerArc = d3
  //           .arc()
  //           .innerRadius(this.radius * 0.9)
  //           .outerRadius(this.radius * 0.9);
  //         var pos = outerArc.centroid(d2);
  //         var width = 960,
  //           height = 450;
  //         var radius = Math.min(width, height) / 2;
  //         pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
  //         var arc = d3
  //           .arc()
  //           .outerRadius(radius * 0.8)
  //           .innerRadius(radius * 0.4);
  //         return [arc.centroid(d2), outerArc.centroid(d2), pos];
  //       };
  //     });

  //   polyline.exit().remove();
  // }
}
