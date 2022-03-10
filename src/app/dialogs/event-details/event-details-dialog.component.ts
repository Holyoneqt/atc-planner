import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BandEvent } from 'src/app/models/band-event';

import { getNameOfMonth } from '../../utils/date.util';
import { CreateEventDialogComponent } from '../create-event/create-event-dialog.component';

export interface EventDetailsDialogInputData {
  event: BandEvent;
}

export interface EventDetailsDialogReturnData {
  delete?: boolean;
}

@Component({
  selector: 'app-event-details-dialog',
  templateUrl: './event-details-dialog.component.html',
  styleUrls: ['./event-details-dialog.component.scss']
})
export class EventDetailsDialogComponent implements OnInit {

  public getNameOfMonth = getNameOfMonth;

  constructor(public dialogRef: MatDialogRef<CreateEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventDetailsDialogInputData,) { }

  public ngOnInit(): void {
  }

  public close(shouldDelete: boolean = false): void {
    this.dialogRef.close({
      delete: shouldDelete,
    } as EventDetailsDialogReturnData);
  }

}
