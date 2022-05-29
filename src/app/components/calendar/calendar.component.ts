import { Component, OnInit } from '@angular/core';
import { Database, DatabaseReference, objectVal, ref, set } from '@angular/fire/database';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AttendanceDetailDialogComponent,
  AttendanceDetailsDialogInputData,
  AttendanceDetailsDialogReturnData,
} from 'src/app/dialogs/attendance-detail/attendance-detail-dialog.component';
import {
  CreateEventDialogComponent,
  CreateEventDialogInputData,
  CreateEventDialogReturnData,
} from 'src/app/dialogs/create-event/create-event-dialog.component';
import {
  EventDetailsDialogComponent,
  EventDetailsDialogInputData,
  EventDetailsDialogReturnData,
} from 'src/app/dialogs/event-details/event-details-dialog.component';
import { BandEvent } from 'src/app/models/band-event';
import { BandMember, BandMemberArray } from 'src/app/models/band-members';
import { ContextMenuItem } from 'src/app/models/context-menu.model';
import { DateData } from 'src/app/models/date.model';
import { getCleanBandMemberClassName } from 'src/app/utils/band-members.util';
import { getDaysOfMonth, getNameOfDay, getNameOfMonth } from 'src/app/utils/date.util';

interface CalendarWeek {
  dates: DateData[];
}

interface Attendance {
  date: DateData;
  people: BandMember[];
  details?: {
    [key: string]: string;
  };
}

@Component({
  selector: 'app-calendar',
  templateUrl: 'calendar.component.html',
  styleUrls: ['calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  public selectedMonth: number = 0;
  public selectedYear: number = 0;
  public weeks: CalendarWeek[] = [];

  public isEditing: boolean = false;

  private _attendances: Attendance[] = [];
  public attendances$: Observable<Attendance[]> | undefined;
  private _events: BandEvent[] = [];
  public events$: Observable<BandEvent[]> | undefined;

  private eventsRef: DatabaseReference | undefined;
  private attendanceRef: DatabaseReference | undefined;

  public filter: string[] = [];

  public getCleanBandMemberClassName = getCleanBandMemberClassName;

  constructor(private dialog: MatDialog, private db: Database) {}

  ngOnInit() {
    this.attendanceRef = ref(this.db, 'attendance');
    this.eventsRef = ref(this.db, 'events');
    this.attendances$ = objectVal(this.attendanceRef).pipe(
      map(this.mapToArray)
    );
    this.events$ = objectVal(this.eventsRef).pipe(map(this.mapToArray));

    this.attendances$.subscribe(
      (attendances) => (this._attendances = attendances)
    );
    this.events$.subscribe((events) => (this._events = events));

    this.selectedMonth = new Date().getMonth();
    this.selectedYear = new Date().getFullYear();
    this.weeks = this.getWeeksOfCurrentMonth();
  }

  public getContextMenuForDay(day: number): ContextMenuItem[] {
    const attendance = this.getAttendanceOfDay(day);
    let peopleInContextMenu: ContextMenuItem[] = [];
    if (attendance !== undefined && attendance?.people?.length > 0) {
      peopleInContextMenu = [
        { type: 'seperator' },
        ...attendance.people.map((a) => {
          let displayValue: string = a;
          if ((attendance.details ?? {})[a]) {
            displayValue = `${a} (${(attendance.details ?? {})[a]})`
          }
          return {
            type: 'item',
            display: displayValue,
            key: a,
          } as ContextMenuItem;
        }),
      ];
    }

    const events = this.getEventsOfDay(day);
    let eventsInContextMenu: ContextMenuItem[] = [];
    if (events.length > 0) {
      eventsInContextMenu = [
        ...events.map(
          (e) =>
            ({
              type: 'item',
              display: e.name,
              key: `event-${e.name}`,
              icon: 'search',
            } as ContextMenuItem)
        ),
        { type: 'seperator' },
      ];
    }

    return [
      ...eventsInContextMenu,
      { type: 'item', display: 'Add Event', icon: 'event', key: 'add-event' },
      ...peopleInContextMenu,
    ];
  }

  public handleContextMenuClick(date: DateData, event: string): void {
    console.log(date, event);
    if (event === 'add-event') {
      this.dialog
        .open(CreateEventDialogComponent, {
          data: {
            day: date.day,
            month: getNameOfMonth(date.month!),
          } as CreateEventDialogInputData,
        })
        .afterClosed()
        .subscribe((data: CreateEventDialogReturnData) => {
          console.log(data);
          if (!data) return;
          this._events.push({
            date,
            name: data.name,
            members: data.members,
            time: data.time,
            note: data.note,
          });
          set(this.eventsRef!, this._events);
        });
    }

    if (event.startsWith('event')) {
      const events = this.getEventsOfDay(date.day);
      const eventName = event.substring('event-'.length);
      const eventIndex = events.findIndex((e) => e.name === eventName);
      this.dialog
        .open(EventDetailsDialogComponent, {
          data: {
            event: events[eventIndex],
          } as EventDetailsDialogInputData,
          width: '100vw',
          autoFocus: false,
        })
        .afterClosed()
        .subscribe((data: EventDetailsDialogReturnData) => {
          const overallEventIndex = this._events.findIndex(
            (e) =>
              e.date.day === date.day &&
              e.date.month === this.selectedMonth &&
              e.date.year === this.selectedYear &&
              e.name === eventName
          );

          if (data.delete) {
            this._events.splice(overallEventIndex, 1);
            set(this.eventsRef!, this._events);
          } else {
            this._events[overallEventIndex].time = data.time;
            this._events[overallEventIndex].note = data.note;
            this._events[overallEventIndex].members = data.members;
            set(this.eventsRef!, this._events);
          }
        });
    }

    if (BandMemberArray.includes(event as BandMember)) {
      this.dialog
        .open(AttendanceDetailDialogComponent, {
          data: {
            member: event,
            date: date,
          } as AttendanceDetailsDialogInputData,
          width: '100vw',
          autoFocus: false,
        })
        .afterClosed()
        .subscribe((data: AttendanceDetailsDialogReturnData) => {
          if (data) {
            console.log(data);
            this.updateAttendanceDetailOfDay(
              date,
              event as BandMember,
              data.time
            );
          }
        });
    }
  }

  public handleFilterChange(event: any): void {
    const checked = event.target.checked;
    const filterValue = event.target.id;
    if (checked) {
      this.filter.push(filterValue);
    } else {
      const index = this.filter.findIndex((f) => f === filterValue);
      this.filter.splice(index, 1);
    }
  }

  public getAttendanceOfDay(day: number): Attendance | undefined {
    const attendance = this._attendances.find(
      (a) =>
        a.date.day === day &&
        a.date.month === this.selectedMonth &&
        a.date.year === this.selectedYear
    );
    return attendance;
  }

  public getEventsOfDay(day: number): BandEvent[] {
    const events = this._events.filter(
      (e) =>
        e.date.day === day &&
        e.date.month === this.selectedMonth &&
        e.date.year === this.selectedYear
    );
    return events ?? [];
  }

  public changeMonth(by: number): void {
    let newMonth = this.selectedMonth + by;
    if (newMonth < 0) {
      newMonth = 11;
      this.selectedYear -= 1;
    }
    if (newMonth > 11) {
      newMonth = 0;
      this.selectedYear += 1;
    }

    this.selectedMonth = newMonth;
    this.weeks = this.getWeeksOfCurrentMonth();
  }

  public startEdit(): void {
    this.isEditing = true;
  }

  public saveEditChanges(): void {
    this.isEditing = false;
    set(this.attendanceRef!, this._attendances);
  }

  public handleCalendarDayClick(date: DateData): void {
    if (date.day === 0) return;
    if (this.isEditing) {
      this.addAttendaceToDay(date);
    }
  }

  private addAttendaceToDay(date: DateData): void {
    const currentMember: BandMember = localStorage.getItem(
      'atc-member'
    ) as BandMember;
    if (!currentMember) return;

    const attendance = this._attendances.find(
      (a) =>
        a.date.day === date.day &&
        a.date.month === this.selectedMonth &&
        a.date.year === this.selectedYear
    );
    if (attendance && attendance.people) {
      const attendanceIndex = attendance.people.findIndex(
        (mem) => mem === currentMember
      );
      console.log(attendanceIndex);
      if (attendanceIndex === -1) {
        attendance.people.push(currentMember);
      } else {
        attendance.people.splice(attendanceIndex, 1);
      }
    } else {
      this._attendances.push({
        date,
        people: [currentMember],
      });
    }
  }

  private updateAttendanceDetailOfDay(
    date: DateData,
    member: BandMember,
    detail: string
  ): void {
    const attendanceIndex = this._attendances.findIndex(
      (a) =>
        a.date.day === date.day &&
        a.date.month === date.month &&
        a.date.year === date.year
    );

    console.log(attendanceIndex);
    if (attendanceIndex === -1) return;
    if (this._attendances[attendanceIndex].details === undefined) {
      this._attendances[attendanceIndex].details = {};
    }

    this._attendances[attendanceIndex].details![member] = detail;
    set(this.attendanceRef!, this._attendances);
  }

  private getWeeksOfCurrentMonth(): CalendarWeek[] {
    const days = this.getDaysOfCurrentMonth();
    const weeks: CalendarWeek[] = [];
    let daysOfWeek: DateData[] = [];
    days.forEach((date, index) => {
      daysOfWeek.push({
        day: date.day,
        month: this.selectedMonth,
        year: this.selectedYear,
      });
      if (this.nameOfDay(date.day) === 'So' || index === days.length - 1) {
        weeks.push({
          dates: daysOfWeek,
        });
        daysOfWeek = [];
      }
    });

    const daysInFirstWeek = weeks[0].dates.length;
    const daysInLastWeek = weeks[weeks.length - 1].dates.length;

    if (daysInFirstWeek !== 7) {
      for (let i = 0; i < 7 - daysInFirstWeek; i++) {
        weeks[0].dates.unshift({ day: 0 });
      }
    }
    if (daysInLastWeek !== 7) {
      for (let i = 0; i < 7 - daysInLastWeek; i++) {
        weeks[weeks.length - 1].dates.push({ day: 0 });
      }
    }

    console.log(weeks);
    return weeks;
  }

  public getDaysOfCurrentMonth(): DateData[] {
    return new Array(getDaysOfMonth(this.selectedMonth, this.selectedYear))
      .fill(0)
      .map(
        (_, i) =>
          ({
            day: i + 1,
            month: this.selectedMonth,
            year: this.selectedYear,
          } as DateData)
      );
  }

  public nameOfDay(day: number): string {
    return getNameOfDay(day, this.selectedMonth, this.selectedYear);
  }

  public nameOfMonth(): string {
    return getNameOfMonth(this.selectedMonth);
  }

  public isCurrentDay(day: number): boolean {
    return (
      new Date().getDate() === day &&
      new Date().getMonth() === this.selectedMonth
    );
  }

  public isHighlighted(date: DateData): boolean {
    if (this.filter.length === 0) return false;

    const attendance = this.getAttendanceOfDay(date.day);
    if (attendance === undefined) return false;
    if (attendance!.people === undefined) return false;

    let shouldHighlight = true;
    this.filter.forEach((f) => {
      if (attendance.people.indexOf(f as BandMember) === -1) {
        shouldHighlight = false;
      }
    });
    return shouldHighlight;
  }

  private mapToArray(value: any): any[] {
    if (value === null) return [];
    return Object.keys(value).map((key) => value[key]);
  }
}
