import { AnimationEvent } from '@angular/animations';
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { ContextMenuItem } from 'src/app/models/context-menu.model';

import { ContextMenuComponent } from './context-menu.component';

@Directive({
  selector: '[appContextMenu]',
})
export class ContextMenuDirective implements OnInit {
  @Input('appContextMenu') items: ContextMenuItem[] = [];
  @Output('contextMenuClick') onContextMenuItemClick =
    new EventEmitter<string>();

  @Input() contextMenuDisabled: boolean = false;

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent) {
    event.stopPropagation();
    if (!this.contextMenuDisabled) {
      this.handleOnClick();
    }
  }

  private overlayRef!: OverlayRef;
  private contextMenuRef!: ComponentRef<ContextMenuComponent>;
  private contextMenuAfterClosed!: Observable<AnimationEvent>;
  private contextMenuClickListener!: Subscription;

  constructor(
    private overlayPositionBuilder: OverlayPositionBuilder,
    private elementRef: ElementRef,
    private overlay: Overlay
  ) {}

  ngOnInit(): void {
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        {
          originX: 'start',
          originY: 'center',
          overlayX: 'end',
          overlayY: 'top',
        },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });
    this.overlayRef.backdropElement;
    this.overlayRef.backdropClick().subscribe(() => this.handleOnClick());
  }

  private handleOnClick(): void {
    if (this.overlayRef.hasAttached()) {
      this.hide();
    } else {
      this.show();
    }
  }

  public show(): void {
    const tooltipPortal = new ComponentPortal(ContextMenuComponent);
    this.contextMenuRef = this.overlayRef.attach(tooltipPortal);
    this.contextMenuRef.instance.items = this.items;
    this.contextMenuClickListener =
      this.contextMenuRef.instance.itemClick.subscribe((key) => {
        this.onContextMenuItemClick.emit(key);
        this.hide();
      });

    this.contextMenuAfterClosed =
      this.contextMenuRef.instance.animationStateChanged.pipe(
        filter((e) => e.phaseName === 'done' && e.toState === 'void'),
        first()
      );
  }

  public hide(): void {
    this.contextMenuClickListener.unsubscribe();
    this.contextMenuAfterClosed.subscribe((_) => this.overlayRef.detach());
    this.contextMenuRef.instance.startCloseAnimation();
  }
}
