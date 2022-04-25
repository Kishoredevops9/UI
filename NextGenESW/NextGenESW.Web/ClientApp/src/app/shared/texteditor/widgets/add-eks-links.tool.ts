
import { TexteditorHelper } from '@app/shared/texteditor/texteditor.helper';
import { AddonsPopupComponent } from '@app/activity-page/activity-details/activity-components/addons-popup/addons-popup.component';
import { AddonsPopupSearchComponent } from '@app/shared/component/addons-popup-search/addons-popup-search.component';

declare var $;

export const AddEksLinksTool = (dialog) => {
  const CONTENT_TYPE_MAPPING = {
    'I': 'WI',
    'G': 'GB',
    'S': 'DS',
    'A': 'AP',
    'C': 'CG',
    'K': 'KP',
    'R': 'RC',
    'T': 'TOC',
    'F': 'SF',
    'P': 'M'
  };
  const CONTENT_TYPE_CLASS_MAPPING = {
    'WI': 'draged-list-wi',
    'I': 'draged-list-wi',
    'AP': 'draged-list-ap',
    'A': 'draged-list-ap',
    'CG': 'draged-list-cg',
    'C': 'draged-list-cg',
    'GB': 'draged-list-gb',
    'G': 'draged-list-gb',
    'RC': 'draged-list-rc',
    'R': 'draged-list-rc',
    'DS': 'draged-list-ds',
    'D': 'draged-list-ds',
    'S': 'draged-list-ds',
    'M': 'draged-list-m',
    'P': 'draged-list-m',
    'ToC': 'draged-list-toc',
    'TOC': 'draged-list-toc',
    'T': 'draged-list-toc',
    'KP': 'draged-list-kp',
    'K': 'draged-list-kp',
    'F': 'draged-list-sf',
    'SP': 'draged-list-sf'
  };

  let editor;
  let container;

  function onOpenAddonsPopupSearch() {
    container = this;
    editor = $(container).data('kendoEditor');
    const dialogRef = dialog.open(AddonsPopupSearchComponent, {
      width: '90%',
      height: '85%',
      maxWidth: '100%',
      data: {
        type: '',
        message: 'ADD ONS',
        showEksPanel: false
      }
    });

    dialogRef.afterClosed().subscribe((selectedDocuments) => {
      if ( selectedDocuments && selectedDocuments !== 'No' && selectedDocuments.length ) {
        const newHtml = getConvertedHtml(selectedDocuments);
        newHtml.forEach((htmlContent) => {
          editor.exec('inserthtml', { value: htmlContent });
        });
      }
    });
  }

  function getConvertedHtml(selectedDocuments) {
    const baseURL = window.location.origin + '/view-document';
    return selectedDocuments.map((currentDoc) => {
      currentDoc.componenttype = currentDoc.assettypecode.toUpperCase();
      const currentContentType = CONTENT_TYPE_MAPPING[currentDoc.componenttype] || '';
      let linkHref = `${ baseURL }/${ currentContentType }/${ currentDoc.contentid }`;
      if ( (currentContentType === 'WI') || (currentContentType === 'GB') || (currentContentType === 'DS') ) {
        linkHref = `${ baseURL }/${ currentDoc.contentid }`;
      }
      return `<br />&nbsp;&nbsp;<span class="${ CONTENT_TYPE_CLASS_MAPPING[currentDoc.componenttype] }"><a class=ct-icons" target="_blank" href="${ linkHref }">${ currentContentType }</span>${ currentDoc.title }</a> <br />`;
    });
  }

  return {
    name: 'document-manager',
    icon: 'document-manager',
    tooltip: 'Add EKS links',
    exec: onOpenAddonsPopupSearch
  };
};
