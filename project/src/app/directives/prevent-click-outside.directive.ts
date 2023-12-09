import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPreventClickOutside]',
  standalone: true,
})
export class PreventClickOutsideDirective {
  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  handleClick(event: Event): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}
