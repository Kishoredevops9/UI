import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActivityModelboxComponent } from './add-activity-modelbox.component';

describe('AddActivityModelboxComponent', () => {
  let component: AddActivityModelboxComponent;
  let fixture: ComponentFixture<AddActivityModelboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddActivityModelboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActivityModelboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
