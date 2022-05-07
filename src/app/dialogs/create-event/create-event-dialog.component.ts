import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface CreateEventDialogInputData {
  day: number;
  month: string;
}

export interface CreateEventDialogReturnData {
  name: string;
  members: string;
  time: string;
  note: string;
}

@Component({
  selector: 'app-create-event-dialog',
  templateUrl: './create-event-dialog.component.html',
  styleUrls: ['./create-event-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'app-create-event-dialog',
  },
})
export class CreateEventDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CreateEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateEventDialogInputData,
  ) {}

  ngOnInit(): void {
    
  }

  public save(name: string, members: string, time: string, note: string): void {
    this.dialogRef.close({
      name, members, time, note
    } as CreateEventDialogReturnData);
  }

}
