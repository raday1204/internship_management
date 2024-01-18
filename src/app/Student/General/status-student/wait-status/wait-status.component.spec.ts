import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitStatusComponent } from './wait-status.component';

describe('WaitStatusComponent', () => {
  let component: WaitStatusComponent;
  let fixture: ComponentFixture<WaitStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WaitStatusComponent]
    });
    fixture = TestBed.createComponent(WaitStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
