import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RelatedContentDetailsComponent } from './related-content-details.component';

describe('RelatedContentDetailsComponent', () => {
  let component: RelatedContentDetailsComponent;
  let fixture: ComponentFixture<RelatedContentDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RelatedContentDetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedContentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
