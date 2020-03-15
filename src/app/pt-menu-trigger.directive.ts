import {AfterViewInit, Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {ConnectionPositionPair, FlexibleConnectedPositionStrategy, Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';
import {POSITION_MAP} from './connection-position-pair';
import {merge, Subject, Subscription} from 'rxjs';
import {debounceTime, filter, tap} from 'rxjs/operators';
import {ESCAPE, hasModifierKey} from '@angular/cdk/keycodes';
import {PtMenuComponent} from './pt-menu/pt-menu.component';

enum MenuState {
  closed = 'closed',
  opened = 'opened',
}

@Directive({
  selector: '[appPtMenuTrigger]'
})
export class PtMenuTriggerDirective implements OnInit, OnDestroy, AfterViewInit {
  @Input() appPtMenuTrigger: PtMenuComponent;
  @Input() ptMenuPosition = 'rightTop';
  @Input() triggerBy: 'click' | 'hover' | null = 'click';

  private menuState = MenuState.closed;
  private portal: TemplatePortal;
  private positions: ConnectionPositionPair[] = [
    POSITION_MAP.rightTop,
    POSITION_MAP.right
  ];
  private overlayRef: OverlayRef;
  private subscription = Subscription.EMPTY;
  private readonly hover$ = new Subject<boolean>();
  private readonly click$ = new Subject<boolean>();

  constructor(
    private el: ElementRef,
    private overlay: Overlay,
    private vcr: ViewContainerRef,
  ) { }
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initialize();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.appPtMenuTrigger) {
      return;
    }
    this.click$.next(true);
  }

  @HostListener('mouseenter', ['$event'])
  onMouseEnter() {
    this.hover$.next(true);
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave() {
    this.hover$.next(false);
  }

  openMenu() {
    if (this.menuState === MenuState.opened) {
      return;
    }
    const overlayConfig = this.getOverlayConfig();
    this.setOverlayPosition(overlayConfig.positionStrategy as FlexibleConnectedPositionStrategy);
    const overlayRef = this.overlay.create(overlayConfig);

    overlayRef.attach(this.getPortal());
    this.subscribeOverlayEvent(overlayRef);
    this.overlayRef = overlayRef;
    this.menuState = MenuState.opened;
  }

  closeMenu() {
    if (this.menuState === MenuState.opened) {
      this.overlayRef?.detach();
      this.menuState = MenuState.closed;
    }
  }

  private initialize() {
    const menuVisible$ = this.appPtMenuTrigger.visible$;
    const hover$ = merge(menuVisible$, this.hover$).pipe(
      debounceTime(100)
    );

    /*  ---true---false----
     *  ---------------true----false
     */
    const handle$ = this.triggerBy === 'hover' ? hover$ : this.click$;
    handle$.pipe(
      tap(state => console.log(state))
    ).subscribe(value => {
      if (value) {
        this.openMenu();
        return;
      }
      this.closeMenu();
    });
  }

  private getOverlayConfig(): OverlayConfig {
    const positionStrategy = this.overlay.position().flexibleConnectedTo(this.el);
    return new OverlayConfig({
      positionStrategy,
      minWidth: '200px',
      hasBackdrop: this.triggerBy !== 'hover',
      backdropClass: 'pt-menu-backdrop',
      panelClass: 'pt-menu-panel',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
  }

  private setOverlayPosition(positionStrategy: FlexibleConnectedPositionStrategy) {
    positionStrategy.withPositions([...this.positions]);
  }

  private getPortal(): TemplatePortal {
    if (!this.portal || this.portal.templateRef !== this.appPtMenuTrigger.menuTemplate) {
      this.portal = new TemplatePortal<any>(this.appPtMenuTrigger.menuTemplate, this.vcr);
    }
    return this.portal;
  }

  private subscribeOverlayEvent(overlayRef: OverlayRef) {
    this.subscription.unsubscribe();
    this.subscription = merge(
      overlayRef.backdropClick(),
      overlayRef.detachments(),
      overlayRef.keydownEvents().pipe(
        filter(event => event.keyCode === ESCAPE && !hasModifierKey(event))
      )
    ).subscribe(() => {
      this.closeMenu();
    });
  }
}
