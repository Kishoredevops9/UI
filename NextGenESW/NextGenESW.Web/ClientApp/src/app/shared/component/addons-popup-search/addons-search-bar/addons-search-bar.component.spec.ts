import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonsSearchBarComponent } from './addons-search-bar.component';

describe('AddonsSearchBarComponent', () => {
  let component: AddonsSearchBarComponent;
  let fixture: ComponentFixture<AddonsSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddonsSearchBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddonsSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
