import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PtMenuComponent } from './pt-menu.component';

describe('PtMenuComponent', () => {
  let component: PtMenuComponent;
  let fixture: ComponentFixture<PtMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PtMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PtMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
