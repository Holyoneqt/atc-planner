import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BandMember } from 'src/app/models/band-members';
import { DateData } from 'src/app/models/date.model';

import { getNameOfMonth } from '../../utils/date.util';
import { CreateEventDialogComponent } from '../create-event/create-event-dialog.component';

export interface AttendanceDetailsDialogInputData {
  date: DateData;
  member: BandMember;
  time: string;
}

export interface AttendanceDetailsDialogReturnData {
  time: string;
}

@Component({
  selector: 'app-attendance-detail-dialog',
  templateUrl: './attendance-detail-dialog.component.html',
  styleUrls: ['./attendance-detail-dialog.component.scss']
})
export class AttendanceDetailDialogComponent implements OnInit {

  public getNameOfMonth = getNameOfMonth;

  public time: string = '';

  constructor(public dialogRef: MatDialogRef<CreateEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AttendanceDetailsDialogInputData,) { }

  public ngOnInit(): void {
    this.time = this.data.time ?? '';
  }

  public close(): void {
    this.dialogRef.close({
      time: this.time,
    } as AttendanceDetailsDialogReturnData);
  }

}
