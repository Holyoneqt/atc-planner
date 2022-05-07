import { DateData } from './date.model';

export interface BandEvent {
  date: DateData;
  name: string;
  members?: string;
  note: string;
  time?: string;
}