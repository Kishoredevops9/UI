import { Component, OnInit, Input, Inject } from '@angular/core';
import { ActivityPageService } from '../../../activity-page.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DomSanitizer } from '@angular/platform-browser';
import { CriteriaGroupPageService } from '@app/criteria-group/criteria-group.service';
import { MatTable } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import { ContextInfo } from '@app/shared/component/global-panel/context/context.model';
import { ContextService } from '@app/shared/component/global-panel/context/context.service';
import { ContentCommonService } from '@app/shared/content-common.service';

@Component({
  selector: 'app-content-details',
  templateUrl: './content-details.component.html',
  styleUrls: ['./content-details.component.scss'],
})
export class ContentDetailsComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>;
  filterFlag: boolean = false;
  contentTypeNew: any;
  criteriaFlag: boolean = false;
  criteriaData = [];
  criteriaDataNew = [];
  criteriaPurpose:any = '';
  testdataANY: any = [];
  bottomLineStyle = '';
  borderLineStyle = '';
  config: AngularEditorConfig = {
    sanitize: false,
    showToolbar: true,
    editable: true,
    spellcheck: true,
    // height: '15rem',
    // minHeight: '5rem',
    height: 'auto',
    minHeight: '270px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      [
        'strikeThrough',
        'subscript',
        'superscript',
        'justifyLeft',
        'indent',
        'insertHorizontalRule',
        'clearFormatting',
        'outdent',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'backgroundColorPicker',
        'insertVideo',
        'fontSize','fontName','removeFormat',
      ],
    ]
  };

  config1: AngularEditorConfig = {
    sanitize: false,
    showToolbar: false,
    editable: false,
    spellcheck: true,
    // height: '10rem',
    // width: '100%',
    // minHeight: '10rem',
    height: 'auto',
    minHeight: '235px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    toolbarHiddenButtons: [
      [
        'strikeThrough',
        'subscript',
        'superscript',
        'justifyLeft',
        'indent',
        'insertHorizontalRule',
        'clearFormatting',
        'outdent',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'backgroundColorPicker',
        'insertVideo',
        'fontSize','fontName','removeFormat',
      ],
    ]
  };
  purpose: any;
  definition: any;
  input = '';
  loading = false;
  extractedDocTable$ = [];
  displayedColumns: string[] = ['id', 'docSourceId', 'comments'];
  displayedColumn: string[] = [
    'no',
    'designCriteria',
    'rationale',
    'links',
    'bpOrC',
  ];
  @Input() contentInfo: any;
  @Input() docStatus;
  content: any;
  activityContent;
  constructor(
    private activityPageService: ActivityPageService,
    private a: DomSanitizer,
    private criteriaGroupService: CriteriaGroupPageService,
    private contextService: ContextService,
    private contentCommonService: ContentCommonService,
    ) { }

  ngOnInit(): void {
    
    // this.contentInfo.forEach(element => {
    //   this.content = element.content;
    // });
    console.log( 'this.docStatus', this.docStatus);
    this.content = this.contentInfo;
    // this.content = this.contentInfo;
    console.log('contentInfo', this.content);
    this.fetchDocumentDetails();
  }
  loadContextInfo() {
    this.contextService.ContextInfo = this.getContextInfo();
  }

  getContextInfo() {
    const contextInfo: ContextInfo = new ContextInfo();
    contextInfo.activityContent = this.activityContent;
    return contextInfo;
  }
  fetchDocumentDetails() {
    // if (this.content.contentType == 'CG' && this.content.contentnumber > 0) {
    //   this.bottomLineStyle = 'bottom-line-cg';
    //   this.borderLineStyle = 'border-line-cg';
    //   this.criteriaFlag = true;
    //   this.loadContentCriteriaData();
    //   // this.criteriaGroupService.getCriteriaGroupPageList(this.content.contentId).subscribe((data) => {
    //   //       if (data) {
    //   //         var res = JSON.parse(JSON.stringify(data));
    //   //         this.criteriaPurpose = res.purpose;
    //   //         this.criteriaData = res.criteria;
    //   //         res.criteria.forEach((el) => {
    //   //           return (el['bpOrC'] = el.bpOrC == 'BP' ? false : true);
    //   //         });
    //   //         this.loading = false;
    //   //         this.table.renderRows();
    //   //       } else {
    //   //         this.loading = false;
    //   //       }
    //   //     },
    //   //     (error) => {
    //   //       console.error('There was an error!', error);
    //   //       this.loading = false;
    //   //     }
    //   //   );
    // } else {
      this.bottomLineStyle =
      this.content.contentType == 'WI'
          ? 'bottom-line-wi'
          : this.content.contentType == 'GB'
            ? 'bottom-line-gb'
            : this.content.contentType == 'DS'
              ? 'bottom-line-ds'
              : this.content.contentType == 'AP'
                ? 'bottom-line-ap'
                : this.content.contentType == 'CG'
                  ? 'bottom-line-cg'
                  : this.content.contentType == 'ToC'
                    ? 'bottom-line-toc'
                    : this.content.contentType == 'RC'
                      ? 'bottom-line-rc'
                      : this.content.contentType == 'SF'
                       ? 'bottom-line-sf'
                       : this.content.contentType == 'SP'
                        ? 'bottom-line-sp'
                      : this.content.contentType == 'KP'
                        ? 'bottom-line-kp'
                        : 'bottom-line-m';
      this.borderLineStyle =
        this.content.contentType == 'WI'
          ? 'border-line-wi'
          : this.content.contentType == 'GB'
            ? 'border-line-gb'
            : this.content.contentType == 'DS'
              ? 'border-line-ds'
              : this.content.contentType == 'AP'
                ? 'border-line-ap'
                : this.content.contentType == 'CG'
                  ? 'border-line-cg'
                  : this.content.contentType == 'ToC' || this.content.contentType == 'TOC'
                    ? 'bottom-line-toc'
                    : this.content.contentType == 'RC'
                      ? 'bottom-line-rc'
                      : this.content.contentType == 'SF'
                      ? 'bottom-line-sf'
                      : this.content.contentType == 'SP'
                      ? 'bottom-line-sp'
                      : this.content.contentType == 'KP'
                        ? 'bottom-line-kp'
                        : 'bottom-line-m';
                        var documentcurrentUserEmail = sessionStorage.getItem('userMail');
                        console.log(' documentcurrentUserEmail',documentcurrentUserEmail);
                        //console.log(' docStatus',this.docStatus);
                        // console.log(' this.content find id',this.content);
                        // console.log(' this.content contentType',this.content.contentType);
                        // console.log(' this.content contentItemId',this.content.contentItemId);
                        // console.log(' this.content contentNo',this.content.contentNo);
                        // console.log(' this.content version',this.content.version);
                        // console.log(' this.contentInfo',this.contentInfo);

                        if(this.content.contentType == "RC" || this.content.contentType == 'KP' || this.content.contentType == 'ToC') {
                          if(this.content.contentType == 'ToC'){
                            this.contentTypeNew = 'TOC';
                            this.content.contentType = this.contentTypeNew;
                          }
                          let version = this.content.version ? this.content.version : '0'; 
                          this.loading = true;
                          this.content.contentNo = this.content.contentNo ? this.content.contentNo : this.content.assetContentId;
                          this.activityPageService
                          .getExtractedWIDocList(this.content.contentNo, this.content.contentType, version)
                          .subscribe(
                            (res) => {
                              this.loading = false;
                              var data = JSON.parse(JSON.stringify(res));
                              if (!(Object.keys(res).length === 0)) {
                                
                                 if((this.content.contentType == "RC" || this.content.contentType == "R")) {
                                  this.criteriaPurpose = data.listRelatedContent.purpose;
                                  // this.criteriaData = data.listRelatedContent.listCriteria;
                                  // this.criteriaData.forEach((el) => {
                                  //   return (el['bpOrC'] = el.bpOrC == 'BP' ? false : true);
                                  // });
                                }  
                                if((this.content.contentType == "TOC" || this.content.contentType == "ToC")) {
                                  this.criteriaPurpose = data.listTOCContent.purpose;
                                  // this.criteriaData = data.listRelatedContent.listCriteria;
                                  // this.criteriaData.forEach((el) => {
                                  //   return (el['bpOrC'] = el.bpOrC == 'BP' ? false : true);
                                  // });
                                } 
                                if((this.content.contentType == "KP" || this.content.contentType == "K")) {
                                  this.criteriaDataNew = data.listKnowledgePackContent;
                                  this.criteriaDataNew.forEach((el) => {
                                    if(el['tabCode']  == 'Purpose'){

                                      if(el['purposeDescription']){
                                        this.testdataANY.push(el['purposeDescription']);
 
                                      }
                                      this.testdataANY.push(el['contentFirst']);
                                      //this.criteriaPurpose = el['contentFirst'];
                                    }
                                  });
                                   this.criteriaPurpose = this.testdataANY;

                                } 
                                
                              } else {
                                this.loading = false;
                              }
                            },
                            (error) => {
                              console.error('There was an error!', error);
                              this.loading = false;
                              this.getDefaultData ();
                            }
                          );
                        }




      if(this.docStatus != 2 && (this.content.contentType == "WI" || this.content.contentType == "I"  || this.content.contentType == "GB"  || this.content.contentType == "DS")) {
        this.loading = true;
        //this.content.contentItemId = this.content.contentItemId ? this.content.contentItemId : this.content.contentNo;
        this.activityPageService
        .fetchDocumentDetails(this.content.contentItemId, this.content.contentType, this.content.contentNo, this.content.version)
        .subscribe(
          (res) => {
            this.loading = false;
            if (res && res.length > 0) {
              this.extractedDocTable$ = res;
              this.getContentsection(this.extractedDocTable$);
            } else {
              this.loading = false;
              this.getDefaultData ();
            }
          },
          (error) => {
            console.error('There was an error!', error);
            this.loading = false;
            this.getDefaultData ();
          }
        );
      } 
      if(this.docStatus == 2) {
        let version = this.content.version ? this.content.version : '0'; 
        this.loading = true;
        this.content.contentNo = this.content.contentNo ? this.content.contentNo : this.content.assetContentId;
        this.activityPageService
        .getExtractedWIDocList(this.content.contentNo, this.content.contentType, version)
        .subscribe(
          (res) => {
            this.loading = false;
            var data = JSON.parse(JSON.stringify(res));
            if (!(Object.keys(res).length === 0)) {
              if((this.content.contentType == "CG" || this.content.contentType == "C")) {
                this.criteriaPurpose = data.listCriteriaPurpose.purpose;
                this.criteriaData = data.listCriteriaPurpose.listCriteria;
                this.criteriaData.forEach((el) => {
                  return (el['bpOrC'] = el.bpOrC == 'BP' ? false : true);
                });
              } else if((this.content.contentType == "WI" || this.content.contentType == "I")) {
                if (this.extractedDocTable$ && this.extractedDocTable$.length > 0) {
                  this.extractedDocTable$ = data.listSP;
                  this.getContentsection(this.extractedDocTable$);
                } else {
                  this.loading = false;
                  this.getDefaultData ();
                }
              }
            } else {
              this.loading = false;
            }
          },
          (error) => {
            console.error('There was an error!', error);
            this.loading = false;
            this.getDefaultData ();
          }
        );
      } else if(this.docStatus != 2 && (this.content.contentType == "CG" || this.content.contentType == "C")) {
        this.loading = true;
        this.activityPageService
        .getCGDraft(this.content.contentItemId)
        .subscribe(
          (res) => {
            this.loading = false;
            var data = JSON.parse(JSON.stringify(res));
            if (!(Object.keys(res).length === 0)) {
                this.criteriaPurpose = data.purpose;
                this.criteriaData = data.listCriteria;
                this.criteriaData.forEach((el) => {
                  return (el['bpOrC'] = el.bpOrC == 'BP' ? false : true);
                });
            }
          },
          (error) => {
            console.error('There was an error!', error);
            this.loading = false;
          }
        );
      }
      
      
   // }
  }

  saveGuidance(event,contentInfo) {
    this.content.guidance = event.target.innerText;
    this.loading = true;
    this.activityPageService
      .updateGuidance(this.content)
      .subscribe((res) => {
        this.activityContent = res;
        this.loadContextInfo();
        this.loading = false;
      });
  }
  handleCheckbox(event, rowData) {
    const div = document.getElementById(rowData.displayTab);
    if (event.checked) {
      div.style.display = 'block';
      this.extractedDocTable$.filter((el) => {
        if (el.id == rowData.id) {
          return (el['checked'] = event.checked);
        }
      });
    } else {
      div.style.display = 'none';
      this.extractedDocTable$.filter((el) => {
        if (el.id == rowData.id) {
          return (el['checked'] = event.checked);
        }
      });
    }
  }
  
  getContentsection(res) {
    res.sort(function (a, b) {
      return a['displayOrder'] - b['displayOrder'];
    });
    for (var i = 0; i < res.length; i++) {
      var title = `<div><b>${res[i].displayTab}</b></div>`;
      switch (res[i].displayTab) {
        case 'Purpose':
        case '1-Purpose':
          const purpose = document.getElementById('Purpose');
          const purposeContent = res[i].purpose;
          purpose.innerHTML = purposeContent ? title + purposeContent : title;
          res[i]['checked'] = true;
          break;
        case 'Definitions':
        case '3-Definitions':
          const def = document.getElementById('Definitions');
          const defContent = res[i].definitions;
          def.innerHTML = defContent ? title + defContent : title;
          res[i]['checked'] = true;
          break;
        case 'Inputs & Outputs':
        case '4-Inputs & Outputs':
          const input = document.getElementById('Inputs & Outputs');
          const inputContent = res[i].inputsOutputsTools;
          input.innerHTML = inputContent ? title + inputContent : title;
          res[i]['checked'] = true;
          break;
        case 'Nature of Change':
        case '7-Nature of Change':
          const nature = document.getElementById('Nature of Change');
          const natureContent = res[i].natureofChange;
          nature.innerHTML = natureContent ? title + natureContent : title;
          res[i]['checked'] = true;
          break;
        case 'Procedure':
        case '2-Procedure':
          const procedure = document.getElementById('Procedure');
          const procedureContent = res[i].procedures;
          procedure.innerHTML = procedureContent
            ? title + procedureContent
            : title;
          res[i]['checked'] = true;
          break;
        case 'Expected Results & Validation':
        case '5-Expected Results & Validation':
          const exp = document.getElementById('Expected Results & Validation');
          const expectedResultContent = res[i].expectedResults;
          exp.innerHTML = expectedResultContent
            ? title + expectedResultContent
            : title;
          res[i]['checked'] = true;
          break;
        case 'Supporting Content':
        case '6-Supporting Content':
          const supportingContent = document.getElementById('Supporting Content');
          const supportingContentResult = res[i].supportingContent;
          supportingContent.innerHTML = supportingContentResult
            ? title + supportingContentResult
            : title;
          res[i]['checked'] = true;
          break;
        default:
          console.log(`${res[i]} is not valid section`);
          break;
      }
    }
  }

  loadContentCriteriaData() {
    const documentcontentId = sessionStorage.getItem('documentcontentId') ? sessionStorage.getItem('documentcontentId') : 0;
    const documentversionCG = sessionStorage.getItem('documentversionCG') ? sessionStorage.getItem('documentversionCG') : 0;
    const documentcurrentUserEmail = sessionStorage.getItem('userMail');
    const documentStatusDetails = sessionStorage.getItem('documentStatusDetails') ? sessionStorage.getItem('documentStatusDetails') : '';
    const documentId: any = sessionStorage.getItem('documentId');
    const documentcontentType = sessionStorage.getItem('documentcontentType') ? sessionStorage.getItem('documentcontentType') : 'CG';


    let statusCheck = sessionStorage.getItem('statusCheck');
    this.loading = true;
    console.log("statusCheck content", statusCheck);
    console.log("this.content.contentId content", this.content.contentId);
    if ((statusCheck == 'true') && this.content.contentId > 0) {
      let documentContentId = sessionStorage.getItem('documentContentId');
      this.criteriaGroupService.getPublishedCriteriaGroupPageListNew(this.content.contentId, documentcontentType, documentStatusDetails, documentcontentId, documentversionCG, documentcurrentUserEmail).subscribe((data) => {
        if (data) {
          var res = JSON.parse(JSON.stringify(data));
          this.criteriaPurpose = res.purpose;
          this.criteriaData = res.criteria;
          res.criteria.forEach((el) => {
            return (el['bpOrC'] = el.bpOrC == 'BP' ? false : true);
          });
          this.loading = false;
          this.table.renderRows();
        } else {
          this.loading = false;
        }
        sessionStorage.removeItem('documentcontentType');
        sessionStorage.removeItem('documentStatusDetails');
        sessionStorage.removeItem('documentcurrentUserEmail');
        sessionStorage.removeItem('documentversionCG');
        sessionStorage.removeItem('documentcontentId');
      },
        (error) => {
          console.error('There was an error!', error);
          this.loading = false;
        }
      );

    }
    else {
      this.criteriaGroupService.getCriteriaGroupPageListNew(this.content.contentId, documentcontentType, documentStatusDetails, documentcontentId, documentversionCG, documentcurrentUserEmail).subscribe((data) => {
        if (data) {
          var res = JSON.parse(JSON.stringify(data));
          this.criteriaPurpose = res.purpose;
          this.criteriaData = res.criteria;
          res.criteria.forEach((el) => {
            return (el['bpOrC'] = el.bpOrC == 'BP' ? false : true);
          });
          this.loading = false;
          this.table.renderRows();
        } else {
          this.loading = false;
        }
        sessionStorage.removeItem('documentcontentType');
        sessionStorage.removeItem('documentStatusDetails');
        sessionStorage.removeItem('documentcurrentUserEmail');
        sessionStorage.removeItem('documentversionCG');
        sessionStorage.removeItem('documentcontentId');
      },
        (error) => {
          console.error('There was an error!', error);
          this.loading = false;
        }
      );

    }

  }
  getDefaultData() {
    const content = `<br/><div>No Content</div>`;
    const purpose = document.getElementById('Purpose');
    purpose.innerHTML = `<b>Purpose</b>` + content;
    const def = document.getElementById('Definitions');
    def.innerHTML = `<b>Definitions</b>` + content;
    const input = document.getElementById('Inputs & Outputs');
    input.innerHTML = `<b>Inputs & Outputs</b>` + content;
    const nature = document.getElementById('Nature of Change');
    nature.innerHTML = `<b>Nature of Change</b>` + content;
    const procedure = document.getElementById('Procedure');
    procedure.innerHTML = `<b>Procedure</b>` + content;
    const exp = document.getElementById('Expected Results & Validation');
    exp.innerHTML = `<b>Expected Results & Validation</b>` + content;
    const supportingContent = document.getElementById('Supporting Content');
    supportingContent.innerHTML = `<b>Supporting Content</b>` + content;
  }
}
