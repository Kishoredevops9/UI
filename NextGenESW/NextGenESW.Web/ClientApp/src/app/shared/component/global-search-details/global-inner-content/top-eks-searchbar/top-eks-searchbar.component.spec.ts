import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopEksSearchbarComponent } from './top-eks-searchbar.component';

describe('TopEksSearchbarComponent', () => {
  let component: TopEksSearchbarComponent;
  let fixture: ComponentFixture<TopEksSearchbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopEksSearchbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopEksSearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
