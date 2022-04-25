import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { documentPath, oldContentTypeCode } from '@environments/constants';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-related-obsolete-content-list',
  templateUrl: './related-obsolete-content-list.component.html',
  styleUrls: [ './related-obsolete-content-list.component.scss' ]
})
export class RelatedObsoleteContentListComponent {
  @Input() contentList;
  assetTypesMapping = {
    'AP': 'AP',
    'A': 'AP',
    'WI': 'WI',
    'I': 'WI',
    'C': 'CG',
    'CG': 'CG',
    'G': 'GB',
    'GB': 'GB',
    'R': 'RC',
    'RC': 'RC',
    'KP': 'KP',
    'K': 'KP',
    'DS': 'DS',
    'S': 'DS',
    'T': 'TOC',
    'TOC': 'TOC',
    'ToC': 'TOC'
  };
  emptyData = new MatTableDataSource([ { empty: 'row' } ]);
  displayedContentColumns: string[] = [
    'documentType',
    'contentId',
    'title',
    'pwStatus',
    'jc'
  ];

  openContent(element) {
    console.log("openContent", element);
    const getStatusValue = element.status?.toLowerCase()?.trim() || 'published';
    const status = getStatusValue.replace(',', '');
    const documentStatus = sessionStorage.getItem('sfStatus');
    const documentType = this.assetTypesMapping[element.assetType];
    switch ( documentType ) {
      case 'WI':
      case 'GB':
      case 'DS':
        if ( status && (status === 'published') ) {
          window.open(
            `${ documentPath.publishViewPath }/${ element.sourceContentId }`,
            '_blank'
          );
        } else {
          window.open(
            `${ documentPath.draftViewPath }/${ element.sourceContentId }?id=${ element.id }&contentType=${ documentType }&status=${ documentStatus }&version=${ element.version }`,
            '_blank'
          );
        }
        break;
      case 'SF':
        if ( status === 'published' ) {
          window.open(
            `${ documentPath.publishViewPath }/${ documentType }/${ element.sourceContentId }?version=${ element.version }&contentType=${ documentType }`,
            '_blank'
          );
        } else {
          window.open(
            `${ documentPath.stepflowDraft }/${ element.id }?version=${ element.version }&contentType=${ documentType }`,
            '_blank'
          );
        }
        break;
      case 'SP':
        if ( status === 'published' ) {
          window.open(
            `${ documentPath.publishViewPath }/${ documentType }/${ element.id }?version=${ element.version }&contentType=${ documentType }`,
            '_blank'
          );
        } else {
          window.open(
            `${ documentPath.stepDraft }/${ documentType }/${ element.id }?version=${ element.version }&contentType=${ documentType }&status=${ documentStatus }`,
            '_blank'
          );
        }
        break;
      default:
        if ( status === 'published' ) {
          window.open(
            `${ documentPath.publishViewPath }/${documentType}/${ element.sourceContentId }?version=${ element.version }&contentType=${ documentType }`,
            '_blank'
          );
        } else {
          window.open(
            `${ documentPath.publishViewPath }/${ documentType }/${ element.sourceContentId }?contentType=${ documentType }&status=${ documentStatus }&version=${ element.version }`,
            '_blank'
          );
        }
    }
  }
}
