import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KPacksPurposeComponent } from './k-packs-purpose.component';

describe('KPacksPurposeComponent', () => {
  let component: KPacksPurposeComponent;
  let fixture: ComponentFixture<KPacksPurposeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KPacksPurposeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KPacksPurposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
