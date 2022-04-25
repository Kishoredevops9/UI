import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RedirectChromeComponent } from './redirect-chrome.component';

describe('RedirectChromeComponent', () => {
  let component: RedirectChromeComponent;
  let fixture: ComponentFixture<RedirectChromeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports:[FormsModule, ReactiveFormsModule],
      declarations: [ RedirectChromeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectChromeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
