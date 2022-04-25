import { ProcessMap } from './process-maps.model';
import { selectProcessMaps } from './../reducers/index';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { ProcessMapsState } from './process-maps.reducer';
import * as fromActions from './process-maps.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '@app/shared/shared.service';
import { ProcessMapsService } from '../process-maps/process-maps.service';

@Component({
  selector: 'app-process-maps',
  templateUrl: './process-maps.component.html',
  styleUrls: ['./process-maps.component.scss']
})
export class ProcessMapsComponent implements OnInit {

  actions=['edit', 'view'];

  processMaps$: Observable<ProcessMap[]>;

  processMapsList: any[] ;
  id:any;
  hasProperty: any = false;
  selectedIndex = 0;
  globalData: any;
  globalDataBuf: any;
  hasPublished = false;
  previewMode: boolean = false;
  docStatusValue:any;
  stepflowData:any;

  displayedColumns: string[] = ['id', 'title', 'description', 'discipline', 'engine_family', 'crown_jewels', 'outsourcable','action'];

  constructor(
    public router:Router,
    private store: Store<ProcessMapsState>,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private processMapsService: ProcessMapsService

    ) { }

  ngOnInit(): void {
    console.log("process-maps-SPSF");
    this.store.dispatch(fromActions.loadProcessMaps());
    this.loadActivitiesMaps();
    this.processMapsService.getProcessMap(this.id)
    .subscribe((data) => {
      this.globalDataBuf = JSON.parse(JSON.stringify(data));
      this.globalData = data;
      this.globalData.originalAssetStatus = data.assetStatus;
      this.globalData.originalAssetStatusId = data.assetStatusId;
    });
    this.route.params.subscribe((param) => {
      this.id = parseInt(param['id']);
    });
      this.hasProperty = isNaN(this.id);
      if (this.sharedService.getNextTab()) {
        let redirect = this.sharedService.getNextTab();
        this.nextTab(redirect)
      }
  }
  //Load list of all process maps from store
  loadActivitiesMaps() {
    this.processMaps$ = this.store.pipe(select(selectProcessMaps));

    this.processMaps$.subscribe( res=> {
      this.processMapsList = res;
    })
  }

  //Delete selected Process Map
  deleteProcessMap(id: string) {
    this.store.dispatch(fromActions.deleteProcessMap({ id}));
  }

  //Opens selected Process Map
  onSelect(element) {
    this.router.navigate(['/process-maps/edit', element.id]);
  }
  //Creates a copy of selected Process Map
  onCopy(id: string) {
    this.store.dispatch(fromActions.copyProcessMap({id}));
  }
  nextTab(redirect) {
    if (redirect) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }

  handleOnPreviewClick(value) {
    this.sharedService.setNextTab(true);
    this.globalData.assetStatusId = this.globalDataBuf.assetStatusId;
    this.globalData.originalAssetStatusId = this.globalDataBuf.assetStatusId;

    this.globalData.assetStatus = this.globalDataBuf.assetStatus;
    this.globalData.originalAssetStatus = this.globalDataBuf.assetStatus;
    if (value) {
      this.hasPublished = false;
      this.previewMode = false;
      this.docStatusValue=1;
    } else {
      this.globalData.assetStatusId = 2;
      this.hasPublished = true;
      this.previewMode = true;
      this.docStatusValue=2;
    }
    this.globalData = JSON.parse(JSON.stringify(this.globalData));
    let redirect = this.sharedService.getNextTab();
    if(this.selectedIndex==0 || this.selectedIndex==1){
      this.nextTab(redirect)
    }
    else{
      this.selectedIndex=0;
    }

  }

}
