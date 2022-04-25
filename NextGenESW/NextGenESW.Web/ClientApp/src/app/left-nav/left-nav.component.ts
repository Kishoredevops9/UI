import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { Observable, Subscription } from 'rxjs';
import { LobbyHomeService } from '@app/lobby-home/lobby-home.service';
import { HttpClient } from '@angular/common/http';
import { PersistanceService } from '@app/shared/persistance.service';
import { environment } from '../../environments/environment';
import { TaskCrationPageService } from '@app/task-creation/task-creation.service';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';
@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss']
})
export class LeftNavComponent implements OnInit {
  AuthTaskUser:any;
  AuthTaskUsercheck:boolean;
  public opened = false;
  public isHidden = true;
  public onLoads: boolean;
  public showHide: boolean = true;
  disableUnCompletedFeatures = environment.disableUnCompletedFeatures;
  disableTaskSearchAndTaskCreation = environment.disableTaskSearchAndTaskCreation;
  disableStepAndStepFlowCreation = environment.disableStepAndStepFlowCreation;
  @Output() open: EventEmitter<any> = new EventEmitter();
  visible: boolean = false;
  private subscription: Subscription;
  disciplineMenuData: any;
  disciplineItems: any;
  reportUrl:any;
  allBrowseManuals;
  navData;
  email: string = '';
  profile;
  userProfileObj = {};
  userProfileDataObj = {};
  @Input() leftPanelData : boolean;
  @Input() leftPanelAdminData : boolean;
  constructor(private router: Router, private _sharedData: SharedService,
    private manuals: LobbyHomeService, private http: HttpClient, private profileDataService: PersistanceService,public TaskCrationPageService: TaskCrationPageService,

  ) { this.reportUrl = environment.EKSPWPlayReportsURL}
  toggle() {
    this.visible = (this.visible) ? false : true;
    this.open.emit(this.visible);
  }

  getLocalhost(){


    return new Promise(resolve => {
      if (localStorage.getItem('logInUserEmail')){
        resolve(localStorage.getItem('logInUserEmail'));
      }

      setInterval(() => {

      if (localStorage.getItem('logInUserEmail')){
        resolve(localStorage.getItem('logInUserEmail'));
      }

      }, 1000);
    });


  }


  ngOnInit(): void {
    let emails = localStorage.getItem('logInUserEmail');
    this.getLocalhost().then((emails)=>{
      this.TaskCrationPageService.getAuthTaskUser(emails).subscribe((data)=>{
        this.AuthTaskUser = data;
        if(this.AuthTaskUser == false){
          this.AuthTaskUsercheck = false;
        }
        else{
          this.AuthTaskUsercheck = true;
        }
        //console.log('this.AuthTaskUsercheck', this.AuthTaskUsercheck);
       })

    })

    let userProfileData = JSON.parse(sessionStorage.getItem('userProfileData'));
    let userProfileMail = userProfileData && userProfileData.userEmail ? userProfileData.userEmail : localStorage.getItem('logInUserEmail')
    this.TaskCrationPageService.getAuthTaskUser(userProfileMail).subscribe((data)=>{
      this.AuthTaskUser = data;
      if(this.AuthTaskUser == false){
        this.AuthTaskUsercheck = false;
      }
      else{
        this.AuthTaskUsercheck = true;
      }
      //console.log('this.AuthTaskUsercheck', this.AuthTaskUsercheck);
     })
    console.log('this.reportUrl', this.reportUrl);
    this._sharedData.dataValues$.subscribe(
      message => {
        this.opened = message;
        this.isHidden = !message;
      }
    )
    this.subscription = this._sharedData.getDisciplineDynamicMenuListData().subscribe(data => {
      this.disciplineItems = data;
    });
    this.browseManuals();
  }

  showSubMenu() {
    this.isHidden = false;
  }

  expandBar() {
    this.opened = !(this.opened);
    this.isHidden = true;
  }

  navigateTo(links) {
 //   if(this.AuthTaskUsercheck) {
      this.showHide = false;
      setTimeout(() => {
        this.showHide = true;
      }, 0)

      this.visible = false;
      this.open.emit(this.visible);
      this.opened = !(this.opened);
      this.router.navigate([links]);
  //  }

  }

  // navigateToReport(reportUrl){
  //   this.router.navigate([reportUrl, '_blank']);
  // }

  browseManuals() {
    this.manuals.getAllBrowseManuals().subscribe(
      (data) => {
        this.allBrowseManuals = data;
      }
    );
  }

  contentAttr() {
    window.open(environment.SSRSContentAttributes,'_blank');
  }
  contentSummary() {
    window.open(environment.SSRSContentSummary,'_blank');
  }

  contentManagement() {
    window.open(environment.QlikAdminContentManagement,'_blank');
  }

  contentEksMetrics() {
    window.open(environment.QlikAdminEKSMetricsUser,'_blank');
  }

  programDeviations() {
    window.open(environment.SSRSContentProgramDeviation,'_blank');
  }

  expertsFinder() {
    window.open(environment.expertsFinder,'_blank');
  }

  engineexplorer() {
    window.open(environment.engineexplorer,'_blank');
  }

  allTaskReportsStatus() {
    window.open(environment.SSRSContentAllTaskReportsStatus,'_blank');
  }

}
