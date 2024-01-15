import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCalendarStudentComponent } from './search-calendar-student.component';

describe('SearchCalendarStudentComponent', () => {
  let component: SearchCalendarStudentComponent;
  let fixture: ComponentFixture<SearchCalendarStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchCalendarStudentComponent]
    });
    fixture = TestBed.createComponent(SearchCalendarStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
