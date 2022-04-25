import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateFromExistingSearchMapComponent } from './create-from-existing-search-map.component';

describe('CreateFromExistingSearchMapComponent', () => {
  let component: CreateFromExistingSearchMapComponent;
  let fixture: ComponentFixture<CreateFromExistingSearchMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFromExistingSearchMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFromExistingSearchMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
