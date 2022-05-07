import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, HostListener, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: '[appInput]',
  templateUrl: 'input.component.html',
  styleUrls: ['input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'app-input',
  },
})
export class InputComponent implements AfterViewInit {
  @HostBinding('class.is-focus')
  private isFocused: boolean = false;

  @HostBinding('class.has-value')
  private hasValue: boolean = false;
  public value: string = '';

  @Output() valueChange = new EventEmitter();

  @HostListener('focus')
  public onFocus() {
    this.isFocused = true;
  }

  @HostListener('blur')
  public onBlur() {
    this.isFocused = false;
  }

  @HostListener('change', ['$event'])
  public onChange(e: Event) {
    this.checkForValue(e.target as HTMLInputElement);
  }

  constructor(private elementRef: ElementRef) {}

  public ngAfterViewInit(): void {
    this.checkForValue(this.elementRef.nativeElement);
  }

  private checkForValue(element: HTMLInputElement): void {
    this.value = element.value;
    this.valueChange.emit(this.value);
    this.hasValue = this.value !== '';
  }
}
