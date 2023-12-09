import { Component, Input, OnInit } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-stack',
  templateUrl: './stack.component.html',
  standalone: true,
  styleUrls: ['./stack.component.scss'],
  imports: [NgClass, NgStyle],
})
export class StackComponent implements OnInit {
  @Input() direction?: 'row' | 'col' = 'col';
  @Input() gap?: number = 1;
  @Input() style?: Partial<CSSStyleDeclaration> = {};
  optionalStyle: Partial<CSSStyleDeclaration> = {};

  ngOnInit() {
    this.optionalStyle = {
      ...this.style,
    };
  }
}
