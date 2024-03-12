import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsOfComponent } from './about-us-of.component';

describe('AboutUsOfComponent', () => {
  let component: AboutUsOfComponent;
  let fixture: ComponentFixture<AboutUsOfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutUsOfComponent]
    });
    fixture = TestBed.createComponent(AboutUsOfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
