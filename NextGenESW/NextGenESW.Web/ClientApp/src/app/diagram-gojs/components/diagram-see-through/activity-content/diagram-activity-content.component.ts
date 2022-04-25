import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CONTENT_TYPES } from './diagram-activity-content.consts';
import { documentPath } from '@environments/constants';
import { Router } from '@angular/router';

// NOTE: This code was extracted from src\app\process-maps\step-flow\step\step-tree\step-tree.component.html

@Component({
  selector: 'app-diagram-see-through-activity-content',
  templateUrl: './diagram-activity-content.component.html',
  styleUrls: ['./diagram-activity-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiagramActivityContentComponent {

  @Input()
  data: any[];

  @Input()
  contentVisibilityMap: any = {};

  @Input()
  isFiltered: boolean

  constructor(
    private router: Router
  ) { }

  getID($i) {
    let d = CONTENT_TYPES.find((node) => {
      return node.contentTypeId == $i;
    })

    return d.code;
  }

  handleOnContentIDClick(item) {
    let data = item;
    let element = item.assetContentId;
    let assetcode = element.split('-')
    let assettypecode = assetcode[1];
    let contentType = (assettypecode == "I") ? "WI" : (assettypecode == "G") ? "GB" : (assettypecode == "S") ? "DS" : (assettypecode == "A") ? "AP" : (assettypecode == "C") ? "CG" : (assettypecode == "K") ? "KP" : (assettypecode == "R") ? "RC" : (assettypecode == "T") ? "TOC" : '';
    sessionStorage.setItem('componentType', contentType);
    sessionStorage.setItem('contentNumber', data.assetContentId);
    sessionStorage.setItem('contentType', 'published');
    sessionStorage.setItem('redirectUrlPath', 'search');
    sessionStorage.setItem('statusCheck', 'true');

    if (assettypecode == 'I' || assettypecode == 'G' || assettypecode == 'S' || assettypecode == 'D') {
      window.open(documentPath.publishViewPath + '/' + data.assetContentId, '_blank');
    } else if (assettypecode === 'M' || assettypecode === 'Map') {
      this.router.navigate(['/process-maps/edit', data.id]);
    } else if (assettypecode === 'F' || assettypecode === 'SF') {
      this.router.navigate(['/process-maps/edit', data.id]);
    } else {
      var assetTypecode = (assettypecode === 'A') ? "AP" : (assettypecode === 'K') ? "KP" : (assettypecode === 'T') ? "TOC" : (assettypecode === 'R') ? "RC" : (assettypecode === 'C') ? "CG" : (assettypecode === 'F') ? "SF" : '';

      window.open(documentPath.publishViewPath + '/' + assetTypecode + '/' + data.assetContentId, '_blank');
    }
  }
}
