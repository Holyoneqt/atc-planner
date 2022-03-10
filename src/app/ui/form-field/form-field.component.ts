import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'app-form-field',
  },
})
export class FormFieldComponent implements OnInit {
  @Input() label: string = '';
  
  ngOnInit(): void {}
}
