import { Component, OnInit, Input } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { ActivityPageService } from '@app/activity-page/activity-page.service';
import { EksInternalSearchComponent } from '../../eks-internal-search/eks-internal-search.component'


@Component({
  selector: 'app-share-url',
  templateUrl: './share-url.component.html',
  styleUrls: ['./share-url.component.scss']
})
export class ShareUrlComponent implements OnInit {
  searchTerm: string;

  @Input() item: string;

  constructor(private shareUrl:ActivityPageService, ) {}

  
  // getshareUrladd() {
  //   const gSearchUrl = window.location.href;
  //   if (gSearchUrl.includes('/')) {
  //     var querySearch = window.location.href.split('=');
  //     this.searchTerm = querySearch[1];
  //   }
  // }


  

  ngOnInit(): void {

  
  }

}
