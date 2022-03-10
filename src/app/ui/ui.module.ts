import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonComponent } from './button/button.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { ContextMenuDirective } from './context-menu/context-menu.directive';
import { FormFieldComponent } from './form-field/form-field.component';
import { IconComponent } from './icon/icon.component';
import { InputComponent } from './input/input.component';

@NgModule({
  imports: [CommonModule, BrowserAnimationsModule],
  exports: [
    IconComponent,
    ButtonComponent,
    ContextMenuDirective,
    ContextMenuComponent,
    InputComponent,
    FormFieldComponent,
    
    MatDialogModule,
  ],
  declarations: [
    IconComponent,
    ButtonComponent,
    ContextMenuDirective,
    ContextMenuComponent,
    InputComponent,
    FormFieldComponent,
  ],
})
export class UiModule {}
