import { Component, HostBinding, Input, OnInit } from '@angular/core';

export type AppButtonAppearance = 'default' | 'warn';

@Component({
  selector: 'button[appButton]',
  templateUrl: 'button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @HostBinding('class')
  @Input() appearance: AppButtonAppearance = 'default';

  constructor() { }

  ngOnInit(): void {
  }

}
