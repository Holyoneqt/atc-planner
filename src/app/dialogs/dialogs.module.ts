import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UiModule } from '../ui/ui.module';
import { AttendanceDetailDialogComponent } from './attendance-detail/attendance-detail-dialog.component';
import { CreateEventDialogComponent } from './create-event/create-event-dialog.component';
import { EventDetailsDialogComponent } from './event-details/event-details-dialog.component';

@NgModule({
	imports: [CommonModule, UiModule],
	declarations: [CreateEventDialogComponent, EventDetailsDialogComponent, AttendanceDetailDialogComponent],
	exports: [CreateEventDialogComponent],
})
export class DialogsModule { }
