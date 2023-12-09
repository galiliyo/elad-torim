import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  standalone: true,
  styleUrls: ['./button.component.scss'],
  imports: [NgClass, NgStyle],
})
export class ButtonComponent {
  @Input('type') typeClass: 'primary' | 'secondary' = 'primary';
  @Input('color') colorClass: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() style?: Partial<CSSStyleDeclaration> = {};
  @Input() disabled?: boolean = false;

  @Output() hover = new EventEmitter<boolean>();
  @Output() click = new EventEmitter<void>();

  onHover(isHovered: boolean): void {
    this.hover.emit(isHovered);
  }

  onClick(): void {
    this.click.emit();
  }
}
