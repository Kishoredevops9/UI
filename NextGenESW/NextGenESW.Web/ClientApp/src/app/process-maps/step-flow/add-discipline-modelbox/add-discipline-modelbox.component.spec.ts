import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDisciplineModelboxComponent } from './add-discipline-modelbox.component';

describe('AddDisciplineModelboxComponent', () => {
  let component: AddDisciplineModelboxComponent;
  let fixture: ComponentFixture<AddDisciplineModelboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDisciplineModelboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDisciplineModelboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
