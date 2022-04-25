import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KPacksDetailsComponent } from './k-packs-details.component';

describe('KPacksDetailsComponent', () => {
  let component: KPacksDetailsComponent;
  let fixture: ComponentFixture<KPacksDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KPacksDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KPacksDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
