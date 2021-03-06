import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContentDetailsComponent } from './content-details.component';

describe('ContentDetailsComponent', () => {
  let component: ContentDetailsComponent;
  let fixture: ComponentFixture<ContentDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
