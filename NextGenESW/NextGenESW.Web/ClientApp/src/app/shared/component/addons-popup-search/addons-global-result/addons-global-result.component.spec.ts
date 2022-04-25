import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EksGlobalTabComponent  } from './addons-global-result.component';

describe('EksGlobalTabComponent ', () => {
  let component: EksGlobalTabComponent ;
  let fixture: ComponentFixture<EksGlobalTabComponent >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EksGlobalTabComponent  ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EksGlobalTabComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
