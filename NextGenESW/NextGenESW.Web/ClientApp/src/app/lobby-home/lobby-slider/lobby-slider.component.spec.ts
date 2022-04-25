import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbySliderComponent } from './lobby-slider.component';

describe('LobbySliderComponent', () => {
  let component: LobbySliderComponent;
  let fixture: ComponentFixture<LobbySliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LobbySliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbySliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
