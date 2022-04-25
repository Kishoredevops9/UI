import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { GlobalService } from '../../global-panel/global.service';
import { Constants, documentPath, oldContentTypeCode, contentTypeCode, assetTypeConstantValue } from '@environments/constants';

@Component({
  selector: 'app-global-inner-content',
  templateUrl: './global-inner-content.component.html',
  styleUrls: ['./global-inner-content.component.scss']
})
export class GlobalInnerContentComponent implements OnInit {

  shareurladd: string;

  componenttypeurl: string = '';
  selectedLabel: string = 'Where Used';
  totalCount = '';
  starSign;
  showDialog: boolean = false;
  @Input() contentTypeInfo: any;
  displayedColumns: string[] = [
    'title',
    'date',
  ];
  dataSource = [];
  config: AngularEditorConfig = {
    sanitize: false,
    showToolbar: true,
    editable: true,
    spellcheck: true,
    //height: '9rem',
    //minHeight: '9rem',
    //width: '16rem',
    height: 'auto',
    minHeight: '270px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    toolbarHiddenButtons: [[
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
    ],]
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

  http: any;
  constructor(
    public dialog4: MatDialog,
    private GlobalService: GlobalService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.shareurladd = this.GlobalService.getShareUrl();
    let purposeResponse : any;
    if (this.contentTypeInfo.assettypecode === 'K') {
      if (this.contentTypeInfo.purpose && this.contentTypeInfo.purpose != null) {
        purposeResponse = JSON.parse(this.contentTypeInfo.purpose);
        this.contentTypeInfo.purpose = purposeResponse?.PurposeDescription || '';
      }
    }
    if (this.contentTypeInfo.assettypecode === 'R') {
      if (this.contentTypeInfo.purpose && this.contentTypeInfo.purpose != null) {
        purposeResponse = this.contentTypeInfo.purpose;
        // console.log(' ---',purposeResponse);
        // console.log(' ++',this.contentTypeInfo.purpose);

        if(purposeResponse['PurposeTitle'] != null){
          this.contentTypeInfo.purpose = purposeResponse['PurposeTitle'];
        }
        // else{
        //   this.contentTypeInfo.purpose = purposeResponse['PurposeDescription'];
        // }
        else if(purposeResponse['PurposeDescription'] != null){
          this.contentTypeInfo.purpose = purposeResponse['PurposeDescription'];
        }
        else{
          purposeResponse = this.contentTypeInfo.purpose;
          this.contentTypeInfo.purpose = purposeResponse;
        }
      }
      // console.log("purposeResponse if data", purposeResponse);
      // console.log("contentTypeInfo if data", this.contentTypeInfo.purpose);
    }
  }

  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  openModal(shareurlbox) {
    let dialogRef = this.dialog4.open(shareurlbox, {
      width: '', height: '',
      // data: { name: this.name, animal: this.animal
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });

    if (this.contentTypeInfo.assettypecode == 'I' || this.contentTypeInfo.assettypecode == 'G' || this.contentTypeInfo.assettypecode == 'S' || this.contentTypeInfo.assettypecode == 'D') {
      this.componenttypeurl = `${window.location.origin}/${documentPath.publishViewPath}/${this.contentTypeInfo.contentid}`;
      console.log("word based share url", this.componenttypeurl);
      //this.router.navigate([documentPath.publishViewPath, this.contentTypeInfo.contentid]);
    } else if (this.contentTypeInfo.assettypecode === 'M' || this.contentTypeInfo.assettypecode === 'Map') {
      this.componenttypeurl = `${window.location.origin}/process-maps/edit/${this.contentTypeInfo.contentnumber}`;
      console.log("process map share url", this.componenttypeurl);
      //this.router.navigate(['/process-maps/edit', this.contentTypeInfo.contentnumber]);
    } else {
      var assetTypecode = (this.contentTypeInfo.assettypecode === 'A') ? "AP" : (this.contentTypeInfo.assettypecode === 'K') ? "KP" : (this.contentTypeInfo.assettypecode === 'T') ? "TOC" : (this.contentTypeInfo.assettypecode === 'R') ? "RC" : (this.contentTypeInfo.assettypecode === 'C') ? "CG" : '';
      this.componenttypeurl = `${window.location.origin}/${documentPath.publishViewPath}/${assetTypecode}/${this.contentTypeInfo.contentid}`;
      console.log("web based share url", this.componenttypeurl);
      //this.router.navigate([documentPath.publishViewPath, assetTypecode, this.contentTypeInfo.contentid]);
    }

  }
  handleOnMatMenuClick(value) {
    this.showDialog = true; //(value != 'Content' && value != 'Task') ;
    this.selectedLabel = value;
    if (value == 'Level Up' || value == 'Level Down' || value == 'Both') {
      let selectedValue = value == 'Level Up' ? 'U' : value == 'Both' ? 'B' : 'D';
      this.GlobalService.getAssetReference(this.contentTypeInfo.contentid, selectedValue).subscribe(data => {
        const res = JSON.parse(JSON.stringify(data));
        if (res.length > 0) {
          this.dataSource = res;
          this.starSign = '*';
          this.totalCount = res.length == 1 ? `${res.length} RESULT` : `${res.length} RESULTS`;
          this.dataSource.forEach((el) => {
            var splitTime = el['assetLastModified'].split('T', 1);
            var date = splitTime[0].split('-');
            el['assetLastModified'] = `${date[1]}/${date[2]}/${date[0]}`;
            el['contentType'] = assetTypeConstantValue(el.assetType);
          });
        } else {
          this.dataSource = res;
          this.starSign = '';
          this.totalCount = '';
        }
      }, (error) => {
        console.log(error);
      })
    }
  }
  handleOnContentIDClick(contentData) {
    let element = contentData;
    let contentId = element.sourceContentId || element.referencedContentId;
    let contentType = (element.assetType == "I") ? "WI" : (element.assetType == "G") ? "GB" : (element.assetType == "S") ? "DS" : (element.assetType == "A") ? "AP" : (element.assetType == "C") ? "CG" : (element.assetType == "K") ? "KP" : (element.assetType == "R") ? "RC" : (element.assetType == "T") ? "TOC" : '';
    if (element.assetType == 'I' || element.assetType == 'G' || element.assetType == 'S') {
      var assetTypecode = (element.assetType === 'I') ? "WI" : element.assetType === 'S' ? "DS" : element.assetType === 'G' ? "GB" : '';
      window.open('/view-document/' + contentId);
    } else if (element.assetType === 'C') {
      window.open('/view-document/CG/' + contentId);
    } else if (element.assetType === 'A') {
      window.open('/view-document/AP/' + contentId);
    } else if (element.assetType === 'K') {
      window.open('/view-document/KP/' + contentId);
    } else if (element.assetType === 'R') {
      window.open('/view-document/RC/' + contentId);
    } else if (element.assetType === 'M') {
      window.open('/process-maps/edit/' + contentId);
    } else if (element.assetType === 'T') {
      window.open('/view-document/TOC/' + contentId);
    }
  }
  handleOnCloseButtonClick() {
    this.dialog4.closeAll();
  }
}


