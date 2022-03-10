import { Component, OnInit } from '@angular/core';

import { BandMember } from './models/band-members';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'atc-planner';
  
  public currentMember: BandMember = 'Luggy';
  public readonly bandMembers: BandMember[] = [
    'Thierry',
    'Chöbbi',
    'Fäbe',
    'Dave',
    'Luggy',
  ];
    
  public ngOnInit(): void {
    const localStorageMember = localStorage.getItem('atc-member') as BandMember;
    this.currentMember = localStorageMember ?? 'Luggy';
  }

  private handleDateClick(arg: any): void {
    console.log(arg);
  }

  public onBandMemberSelect(event: any): void {
    localStorage.setItem('atc-member', event.target.value);
  }
}
