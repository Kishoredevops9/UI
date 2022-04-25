import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHelpItemComponent } from './add-help-item.component';

describe('AddHelpItemComponent', () => {
  let component: AddHelpItemComponent;
  let fixture: ComponentFixture<AddHelpItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHelpItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHelpItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
