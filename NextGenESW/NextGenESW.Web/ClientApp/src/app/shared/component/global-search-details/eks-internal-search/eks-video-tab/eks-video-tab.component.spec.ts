import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EksVideoTabComponent } from './eks-video-tab.component';

describe('EksVideoTabComponent', () => {
  let component: EksVideoTabComponent;
  let fixture: ComponentFixture<EksVideoTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EksVideoTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EksVideoTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
