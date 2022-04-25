import { CdDocumentComponent } from './cd-document/cd-document.component';
import { WiDocumentComponent } from './wi-document/wi-document.component';
import { CreateDocumentComponent } from '../create-document/create-document.component';
import { DesignDetailsComponent } from '../design-standards/design-details/design-details.component';
import { GuideDetailsComponent } from '../guide-book/guide-details/guide-details.component';
import { DocumentViewComponent } from './document-view.component';
import { Routes, RouterModule, ActivatedRoute, Router, ParamMap } from '@angular/router';
import { NgModule } from '@angular/core';
import { CriteriaGroupComponent } from '@app/criteria-group/criteria-group.component';
import { CriteriaDetailsComponent } from '@app/criteria-group/criteria-details/criteria-details.component';
import { KPacksDetailsComponent } from '@app/k-packs/k-packs-details/k-packs-details.component';
import { TocDetailsComponent } from '@app/toc/toc-details/toc-details.component';
import { RelatedContentDetailsComponent } from '@app/related-content/related-content-details/related-content-details.component';
import { ActivityDetailsComponent } from '@app/activity-page/activity-details/activity-details.component';
import { ActivityPageComponent } from '@app/activity-page/activity-page.component';
import { ProcessMapAddComponent } from './../process-maps/process-map-add/process-map-add.component';
import { StepComponent } from '@app/process-maps/step-flow/step/step.component';
import { PublicStepComponent } from './../process-maps/public-step/public-step.component'
import { contentTypeCode, oldContentTypeCode } from '@environments/constants';

//  Component Routing Path

const documentViewUrl = window.location.pathname;
if (documentViewUrl.includes('/view-document/')) {
  let paramContentId = window.location.pathname.split('/');
  let paramContentType = paramContentId[2]?.split("-", 3);
  if (paramContentType[1] == contentTypeCode.workInstruction || paramContentType[1] == contentTypeCode.guideBook || paramContentType[1] == contentTypeCode.designStandard || paramContentType[1] == contentTypeCode.designStandardOld) {
    var contentType = oldContentTypeCode.workInstruction;
  } else if (paramContentType[1] == contentTypeCode.criteriaGroup) {
    var contentType = oldContentTypeCode.criteriaGroup;
  } else if (paramContentType[1] == contentTypeCode.activityPage) {
    var contentType = oldContentTypeCode.activityPage;
  } else if (paramContentType[1] == contentTypeCode.knowledgePack) {
    var contentType = oldContentTypeCode.knowledgePack;
  } else if (paramContentType[1] == contentTypeCode.tableOfContent) {
    var contentType = oldContentTypeCode.tableOfContent;
  } else if (paramContentType[1] == contentTypeCode.relatedContent) {
    var contentType = oldContentTypeCode.relatedContent;
  } else if (paramContentType[1] == contentTypeCode.stepFlow) {
    var contentType = oldContentTypeCode.stepFlow;
  }else if (paramContentType[1] == contentTypeCode.publicStep) {
    var contentType = oldContentTypeCode.publicStep;
   } else if (paramContentType[1] == contentTypeCode.step) {
    var contentType = oldContentTypeCode.step;
  }
}

if (contentType && contentType == oldContentTypeCode.criteriaGroup) {
  var routes: Routes = [
    {
      path: ':contentId', component: CriteriaDetailsComponent, data: { module: 'Criteria Group' }
    }
  ];
} else if (contentType && contentType == oldContentTypeCode.activityPage) {
  var routes: Routes = [
    {
      path: ':contentId', component: ActivityPageComponent, data: { module: 'Activity Details' }
    }
  ];
} else if (contentType && contentType == oldContentTypeCode.knowledgePack) {
  var routes: Routes = [
    {
      path: ':contentId', component: KPacksDetailsComponent, data: { module: 'K Pack' }
    }
  ];
} else if (contentType && contentType == oldContentTypeCode.tableOfContent) {
  var routes: Routes = [
    {
      path: ':contentId', component: TocDetailsComponent, data: { module: 'Table of Content' }
    }
  ];
} else if (contentType && contentType == oldContentTypeCode.relatedContent) {
  var routes: Routes = [
    {
      path: ':contentId', component: RelatedContentDetailsComponent, data: { module: 'Related Content Details' }
    }
  ];
} else if (contentType && contentType == oldContentTypeCode.stepFlow) {
  var routes: Routes = [
    {
      path: ':contentId', component: ProcessMapAddComponent, data: { module: 'Step Flow' }
    }
  ];
} else if (contentType && contentType == oldContentTypeCode.publicStep) {
  var routes: Routes = [
    {
      path: ':contentId', component: PublicStepComponent, data: { module: 'PublicStep' }
    }
  ];
}
 else if (contentType && contentType == oldContentTypeCode.step) {
  var routes: Routes = [
    {
      path: ':id', component: StepComponent, data: { module: 'Step' }
    }
  ];
}

else {
  var routes: Routes = [
    /* view document old routing start here */
    { path: '', component: DocumentViewComponent },
    {
      path: 'view-document/:id/CG', component: CriteriaGroupComponent, data: { module: 'Content Type' }
    },
    {
      path: 'view-document/:id/:documentType', component: WiDocumentComponent, data: { module: 'Content Type' }
    },
    {
      path: 'view-cd-document', component: CdDocumentComponent
    },
    /* view document old routing end here */

    /* view document published new routing start here */
    {
      path: ':contentId', component: WiDocumentComponent, data: { module: 'Content Type' }
    },
    {
      path:  + '/' + ':contentId' + '/' + ':version', component: WiDocumentComponent, data: { module: 'Content Type' }
    },
    {
      path: oldContentTypeCode.criteriaGroup + '/' + ':contentId', component: CriteriaDetailsComponent, data: { module: 'Criteria Group' }
    },
    {
      path: oldContentTypeCode.knowledgePack + '/' + ':contentId', component: KPacksDetailsComponent, data: { module: 'K Pack' }
    },
    {
      path: oldContentTypeCode.tableOfContent + '/' + ':contentId', component: TocDetailsComponent, data: { module: 'Table of Content' }
    },
    {
      path: oldContentTypeCode.relatedContent + '/' + ':contentId', component: RelatedContentDetailsComponent, data: { module: 'Related Content Details' }
    },
    {
      path: oldContentTypeCode.activityPage + '/' + ':contentId', component: ActivityPageComponent, data: { module: 'Activity Details' }
    },
    {
      path: oldContentTypeCode.stepFlow + '/' + ':contentId', component: ProcessMapAddComponent, data: { module: 'Step Flow' }
    },
    {
      path: oldContentTypeCode.publicStep + '/' + ':contentId', component: PublicStepComponent, data: { module: 'PublicStep' }
    },
    {
      path: oldContentTypeCode.step + '/' + ':contentId', component: StepComponent, data: { module: 'Step' }
    },
    /* view document published new routing end here */

    /* EKS Internal Search routing start here */
    {
      path: oldContentTypeCode.criteriaGroup + '/' + ':contentId' + '/' + ':version', component: CriteriaDetailsComponent, data: { module: 'Criteria Group' }
    },
    {
      path: oldContentTypeCode.knowledgePack + '/' + ':contentId' + '/' + ':version', component: KPacksDetailsComponent, data: { module: 'K Pack' }
    },
    {
      path: oldContentTypeCode.tableOfContent + '/' + ':contentId' + '/' + ':version', component: TocDetailsComponent, data: { module: 'Table of Content' }
    },
    {
      path: oldContentTypeCode.relatedContent + '/' + ':contentId' + '/' + ':version', component: RelatedContentDetailsComponent, data: { module: 'Related Content Details' }
    },
    {
      path: oldContentTypeCode.activityPage + '/' + ':contentId' + '/' + ':version', component: ActivityPageComponent, data: { module: 'Activity Details' }
    },
    {
      path: oldContentTypeCode.stepFlow + '/' + ':contentId' + '/' + ':version', component: ProcessMapAddComponent, data: { module: 'Step Flow' }
    },
    {
      path: oldContentTypeCode.publicStep + '/' + ':contentId' + '/' + ':version', component: PublicStepComponent, data: { module: 'PublicStep' }
    },
    {
      path: oldContentTypeCode.step + '/' + ':contentId' + '/' + ':version', component: StepComponent, data: { module: 'Step' }
    },
    {
      path: oldContentTypeCode.workInstruction + '/' + ':contentId' + '/' + ':version', component: CreateDocumentComponent, data: { module: 'Work Instruction' }
    },
    {
      path: ':contentId', component: WiDocumentComponent, data: { module: 'Work Instruction' }
    },
    {
      path: ':contentId'+ '/' +  ':version', component: WiDocumentComponent, data: { module: 'Work Instruction' }
    },
    {
      path: ':contentId', component: GuideDetailsComponent, data: { module: 'Guide Book' }
    },
    {
      path: ':contentId'+ '/' +  ':version', component: GuideDetailsComponent, data: { module: 'Guide Book' }
    },
    {
      path: ':contentId', component: DesignDetailsComponent, data: { module: 'Design Standards' }
    },
    {
      path: ':contentId' + '/' + ':version', component: DesignDetailsComponent, data: { module: 'Design Standards' }
    },

  ];
}

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentViewRoutes { }
