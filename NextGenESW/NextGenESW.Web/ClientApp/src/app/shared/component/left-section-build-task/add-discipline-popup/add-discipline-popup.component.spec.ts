import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDisciplinePopupComponent } from './add-discipline-popup.component';

describe('AddDisciplinePopupComponent', () => {
  let component: AddDisciplinePopupComponent;
  let fixture: ComponentFixture<AddDisciplinePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDisciplinePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDisciplinePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
