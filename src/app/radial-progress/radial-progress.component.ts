import { Component, OnInit, ViewChild, ElementRef, Inject, Input } from '@angular/core';
import * as d3 from 'd3';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-radial-progress',
  templateUrl: './radial-progress.component.html',
  styleUrls: ['./radial-progress.component.sass']
})
export class RadialProgressComponent implements OnInit {
  @Input() props: RadialProgress;
  @ViewChild('radialChart') public radialChart: ElementRef;
  element: any;
  private radius = 100;
  private border = 15;
  private padding = 10;
  private startPercent = 0;
  private endPercent = 0.80;
  private twoPi = Math.PI * 2;
  formatPercent = d3.format('.0%');
  private boxSize = (this.radius + this.padding) * 2;
  private count;
  step = this.endPercent < this.startPercent ? -0.01 : 0.01
  arc: any;
  svg: any;
  gradient: any;
  front: any;
  numberText: any;
  private progress: any;
  private startGradient: string;
  private endGradient: string;
  private fillTime: number;

  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    this.element = this.radialChart.nativeElement;

    // Initialize from input props
    this.radius = this.props.radius;
    this.startPercent = this.props.start;
    this.endPercent = this.props.end;
    this.startGradient = this.props.gradient.start;
    this.endGradient = this.props.gradient.end;
    this.fillTime = this.props.fillTime;

    this.count = Math.abs((this.endPercent - this.startPercent) / 0.01)

    this.progress = this.props.start;
    this.drawRadialProgress();
    this.startFilling();
  }

  private drawRadialProgress() {
    this.arc = d3.arc()
      .startAngle(0)
      .innerRadius(this.radius)
      .outerRadius(this.radius - this.border)
      .cornerRadius(50);

    this.svg = d3.select(this.element).append('svg')
      .attr('width', this.boxSize)
      .attr('height', this.boxSize);

    this.gradient = this.svg.append("svg:defs")
      .append("svg:linearGradient")
      .attr("id", this.props.gradient.id)
      .attr("x1", "0%")
      .attr("y1", "50%")
      .attr("x2", "50%")
      .attr("y2", "0%")
      .attr("spreadMethod", "pad");

    this.gradient.append("svg:stop")
      .attr("offset", "0%")
      .attr("stop-color", this.endGradient)
      .attr("stop-opacity", 1);

    this.gradient.append("svg:stop")
      .attr("offset", "100%")
      .attr("stop-color", this.startGradient)
      .attr("stop-opacity", 1);

    var field = this.svg.append('g')
      .attr('transform', 'translate(' + this.boxSize / 2 + ',' + this.boxSize / 2 + ')');

    var meter = field.append('g')
      .attr('class', 'progress-meter');

    meter.append('path')
      .attr('class', 'background')
      .attr('fill', '#2D2E2F')
      .attr('fill-opacity', 1)
      .attr('d', this.arc.endAngle(this.twoPi));

    this.front = meter.append('path')
      .attr('class', 'foreground')
      .attr('fill', `url(#${this.props.gradient.id})`)
      .attr('fill-opacity', 1);

    this.numberText = meter.append('text')
      .attr('fill', '#fff')
      .attr('text-anchor', 'middle')
      .attr('dy', '.278em')
      .attr('class', 'radial__text');
  }

  startFilling() {
    this.updateBar();

    if (this.count > 0) {
      this.count--;
      this.progress += this.step;
      setTimeout(() => {
        this.startFilling();
      }, this.fillTime);
    }

  }

  updateBar() {
    this.front.attr('d', this.arc.endAngle(this.twoPi * this.progress));
    this.numberText.text(this.formatPercent(this.progress));
  }

}
