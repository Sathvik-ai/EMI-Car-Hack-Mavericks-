import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appIndianCurrency]',
  standalone: false,
})
export class IndianCurrency {

  constructor(private el: ElementRef, private control: NgControl) { }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove all non-digit chars
    const rawNum = value.replace(/[^0-9]/g, '');
    
    if (!rawNum) {
      this.control.control?.setValue(null);
      return;
    }

    const numberValue = parseInt(rawNum, 10);
    const formatted = numberValue.toLocaleString('en-IN');
    
    // Set the input's visual value
    this.el.nativeElement.value = formatted;
    
    // Update the Angular Form Control with the actual number
    this.control.control?.setValue(numberValue, { 
      emitEvent: false, 
      emitModelToViewChange: false 
    });
  }
}
