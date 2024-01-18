import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmStatusComponent } from './confirm-status.component';

describe('ConfirmStatusComponent', () => {
  let component: ConfirmStatusComponent;
  let fixture: ComponentFixture<ConfirmStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmStatusComponent]
    });
    fixture = TestBed.createComponent(ConfirmStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
