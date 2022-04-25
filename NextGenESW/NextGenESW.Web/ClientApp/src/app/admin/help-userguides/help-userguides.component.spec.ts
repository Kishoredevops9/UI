import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpUserguidesComponent } from './help-userguides.component';

describe('HelpUserguidesComponent', () => {
  let component: HelpUserguidesComponent;
  let fixture: ComponentFixture<HelpUserguidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpUserguidesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpUserguidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
