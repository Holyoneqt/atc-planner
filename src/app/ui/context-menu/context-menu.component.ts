import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ContextMenuItem } from 'src/app/models/context-menu.model';

@Component({
  selector: 'app-context-menu',
  templateUrl: 'context-menu.component.html',
  styleUrls: ['context-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('contextMenu', [
      state(
        'open',
        style({
          transform: 'scale(1)',
          opacity: 1,
        })
      ),
      state(
        'void',
        style({
          transform: 'scale(0.8)',
          opacity: 0,
          transformOrigin: 'top right'
        })
      ),
      transition('* => *', animate('.2s ease'))
    ]),
  ],
})
export class ContextMenuComponent {
  public animationState: 'open' | 'void' = 'open';
  public animationStateChanged = new EventEmitter<AnimationEvent>();

  @Input() items: ContextMenuItem[] = [];
  @Output() itemClick = new EventEmitter<string>()

  public startCloseAnimation(): void {
    this.animationState = 'void';
  }

  public onItemClick(item: ContextMenuItem): void {
    if (item.type === 'item') {
      this.itemClick.emit(item.key);
    }
  }

  public onAnimationStart(event: AnimationEvent) {
    this.animationStateChanged.emit(event);
  }
  
  public onAnimationDone(event: AnimationEvent) {
    this.animationStateChanged.emit(event);
  }
}
