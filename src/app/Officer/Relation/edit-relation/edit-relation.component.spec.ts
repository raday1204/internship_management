import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRelationComponent } from './edit-relation.component';

describe('EditRelationComponent', () => {
  let component: EditRelationComponent;
  let fixture: ComponentFixture<EditRelationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditRelationComponent]
    });
    fixture = TestBed.createComponent(EditRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
