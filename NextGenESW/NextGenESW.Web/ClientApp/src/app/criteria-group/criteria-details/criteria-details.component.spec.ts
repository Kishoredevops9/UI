//import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

//import { CriteriaDetailsComponent } from './criteria-details.component';

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CriteriaGroupPageService } from '../criteria-group.service';
import { HttpHelperService } from '@app/shared/http-helper.service';
import { ContextService } from '@app/shared/component/global-panel/context/context.service';
import { GlobalService } from '@app/shared/component/global-panel/global.service';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from '@app/shared/shared.service';
import { ContentCommonService } from '@app/shared/content-common.service';
import { CriteriaDetailsComponent } from './criteria-details.component';

// describe('CriteriaDetailsComponent', () => {
//   let component: CriteriaDetailsComponent;
//   let fixture: ComponentFixture<CriteriaDetailsComponent>;

//   beforeEach(waitForAsync(() => {
//     TestBed.configureTestingModule({
//       declarations: [ CriteriaDetailsComponent ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(CriteriaDetailsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

describe('CriteriaDetailsComponent', () => {
  let component: CriteriaDetailsComponent;
  let fixture: ComponentFixture<CriteriaDetailsComponent>;

  beforeEach(waitForAsync(() => {
    const storeStub = () => ({});
    const activatedRouteStub = () => ({ params: { subscribe: f => f({}) } });
    const routerStub = () => ({
      navigate: array => ({}),
      url: { split: () => ({}) }
    });
    const criteriaGroupPageServiceStub = () => ({
      GetContentID: globalDataBuf => ({ subscribe: f => f({}) }),
      GetRevisionData: globalDataBuf => ({ subscribe: f => f({}) })
    });
    const httpHelperServiceStub = () => ({
      getContentType: contentTypeId => ({})
    });
    const contextServiceStub = () => ({ ContextInfo: {} });
    const globalServiceStub = () => ({});
    const matDialogStub = () => ({
      open: (requestApprovalTemplate, object) => ({}),
      closeAll: () => ({})
    });
    const sharedServiceStub = () => ({
      setNextTab: arg => ({}),
      getNextTab: () => ({})
    });
    const contentCommonServiceStub = () => ({
      getCriteriaGroupData: (
        id,
        documentcontentType,
        documentStatusDetails,
        documentcontentId,
        documentversionCG,
        userEmail
      ) => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CriteriaDetailsComponent],
      providers: [
        { provide: Store, useFactory: storeStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        {
          provide: CriteriaGroupPageService,
          useFactory: criteriaGroupPageServiceStub
        },
        { provide: HttpHelperService, useFactory: httpHelperServiceStub },
        { provide: ContextService, useFactory: contextServiceStub },
        { provide: GlobalService, useFactory: globalServiceStub },
        { provide: MatDialog, useFactory: matDialogStub },
        { provide: SharedService, useFactory: sharedServiceStub },
        { provide: ContentCommonService, useFactory: contentCommonServiceStub }
      ]
    });
    fixture = TestBed.createComponent(CriteriaDetailsComponent);
    component = fixture.componentInstance;
  }));

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`type has default value`, () => {
    expect(component.type).toEqual(`CG`);
  });

  it(`isCheckOut has default value`, () => {
    expect(component.isCheckOut).toEqual(true);
  });

  it(`selectedIndex has default value`, () => {
    expect(component.selectedIndex).toEqual(0);
  });

  it(`contentType has default value`, () => {
    expect(component.contentType).toEqual(`CG`);
  });

  it(`docStatus has default value`, () => {
    expect(component.docStatus).toEqual(1);
  });

  it(`showMenuActions has default value`, () => {
    expect(component.showMenuActions).toEqual(false);
  });

  it(`previewMode has default value`, () => {
    expect(component.previewMode).toEqual(false);
  });

  it(`hasProperty has default value`, () => {
    expect(component.hasProperty).toEqual(false);
  });

  it(`hasPublished has default value`, () => {
    expect(component.hasPublished).toEqual(false);
  });

  it(`isFormDirty has default value`, () => {
    expect(component.isFormDirty).toEqual(false);
  });

  it(`prevSelectedIndex has default value`, () => {
    expect(component.prevSelectedIndex).toEqual(0);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const sharedServiceStub: SharedService = fixture.debugElement.injector.get(
        SharedService
      );
      spyOn(component, 'loadCriteriaData').and.callThrough();
      spyOn(sharedServiceStub, 'setNextTab').and.callThrough();
      component.ngOnInit();
      //expect(component.loadCriteriaData).toHaveBeenCalled();
      expect(sharedServiceStub.setNextTab).toHaveBeenCalled();
    });
  });

  describe('loadContextInfo', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getContextInfo').and.callThrough();
      component.loadContextInfo();
      expect(component.getContextInfo).toHaveBeenCalled();
    });
  });

  describe('loadCriteriaData', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const httpHelperServiceStub: HttpHelperService = fixture.debugElement.injector.get(
        HttpHelperService
      );
      const sharedServiceStub: SharedService = fixture.debugElement.injector.get(
        SharedService
      );
      const contentCommonServiceStub: ContentCommonService = fixture.debugElement.injector.get(
        ContentCommonService
      );
      spyOn(component, 'nextTab').and.callThrough();
      spyOn(component, 'loadContextInfo').and.callThrough();
      spyOn(routerStub, 'navigate').and.callThrough();
      spyOn(httpHelperServiceStub, 'getContentType').and.callThrough();
      spyOn(sharedServiceStub, 'getNextTab').and.callThrough();
      spyOn(contentCommonServiceStub, 'getCriteriaGroupData').and.callThrough();
      component.loadCriteriaData();
      expect(component.nextTab).toHaveBeenCalled();
      expect(component.loadContextInfo).toHaveBeenCalled();
      //expect(routerStub.navigate).toHaveBeenCalled();
      expect(httpHelperServiceStub.getContentType).toHaveBeenCalled();
      expect(sharedServiceStub.getNextTab).toHaveBeenCalled();
      expect(contentCommonServiceStub.getCriteriaGroupData).toHaveBeenCalled();
    });
  });

  describe('handleOnOkButton', () => {
    it('makes expected calls', () => {
      const matDialogStub: MatDialog = fixture.debugElement.injector.get(
        MatDialog
      );
      spyOn(matDialogStub, 'closeAll').and.callThrough();
      component.handleOnOkButton();
      expect(matDialogStub.closeAll).toHaveBeenCalled();
    });
  });
});