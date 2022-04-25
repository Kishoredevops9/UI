import { PersistanceService } from '@app/shared/persistance.service';
import { Component, OnInit, ViewEncapsulation, Input, Inject, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
//import { Logger, CryptoUtils } from 'msal';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { SharedService } from '@app/shared/shared.service';
import { Constants } from '@environments/constants'
import { environment } from '@environments/environment';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';
const GRAPH_PIC = 'https://graph.microsoft.com/v1.0/me/photo/$value';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserAuthComponent implements OnInit, OnDestroy {
  userProfileDataNew
  profile;
  title = 'Demoapp-Frontend';
  isIframe = false;
  loggedIn = false;
  loginDisplay = false;
  profilePicture;
  imageUrl: string | ArrayBuffer;
  isDisabled = true;
  finalInitial: string;
  private readonly _destroying$ = new Subject<void>();
  userProfileDataObj = {};
  userProfileDataObject: any;
  userProfileObj = {};
  @Output() leftNavAdminPanelShow = new EventEmitter<any>();
  @Output() leftNavPanelShow = new EventEmitter<any>();
  constructor(
    //private broadcastService: BroadcastService,
    //private authService: MsalService,
    private http: HttpClient,
    private profileDataService: PersistanceService,
    public dialog: MatDialog,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private sharedData: SharedService
  ) { }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;
    this.checkAccount();
    // this.broadcastService.subscribe('msal:loginSuccess', () => {
    //   this.checkAccount();
    // });
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        this.checkAndSetActiveAccount();
      })

    /*this.authService.handleRedirectCallback((authError, response) => {
      if (authError) {
        return;
      }
    });

    this.authService.setLogger(new Logger((logLevel, message, piiEnabled) => {
          }, {
      correlationId: CryptoUtils.createNewGuid(),
      piiLoggingEnabled: false
    }));*/

    this.getProfile();
    this.getProfilePicture();
  }
  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  checkAndSetActiveAccount() {
    /**
     * If no active account set but there are accounts signed in, sets first account to active account
     * To use active account set here, subscribe to inProgress$ first in your component
     * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
     */
    let activeAccount = this.authService.instance.getActiveAccount();
    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      // sessionStorage.setItem('userMail', accounts[0].username);
      this.authService.instance.setActiveAccount(accounts[0]);
      //console.log("account[0]", accounts[0]);
      this.getProfile()
      this.getProfilePicture();
    }
  }
  checkAccount() {
    //this.loggedIn = !!this.authService.getAccount();
    this.loggedIn = this.authService.instance.getAllAccounts().length > 0;
  }

  login() {
    /*const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

    if (isIE) {
      this.authService.loginRedirect();
    } else {
      this.authService.loginPopup();
    }*/
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      } else {
        this.authService.loginPopup()
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      }
    } else {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
      } else {
        this.authService.loginRedirect();
      }
    }
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  getProfilePicture() {
    this.http.get(GRAPH_PIC, { responseType: 'blob' }).toPromise()
      .then(pic => {
        this.profilePicture =
          this.createImageFromBlob(pic);
      }).catch(function (err) {
        //console.log('Custom Error: ', err.statusText);
      })
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageUrl = reader.result;
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  profileSettings(profileUser, profileUser1) {
    this.openDialog(profileUser, profileUser1);
  }

  openDialog(profileUsers, profileUser1) {
    const dialogRef = this.dialog.open(ProfileSettingsComponent, {
      width: '100%',
      maxWidth: '1024px',
      data: {
        doc: {
          id: profileUsers.id,
          title: profileUsers.jobTitle,
          mail: profileUsers.mail,
          phone: profileUsers.mobilePhone,
          name: profileUsers.displayName,
          surname: profileUsers.surname,
          givenName: profileUsers.givenName,

          aadId: profileUser1.aadId,
          clockId: profileUser1.clockId,
          departmentName: profileUser1.departmentName,
          displayName: profileUser1.displayName,
          eksgroupMembership: profileUser1.eksgroupMembership,
          email: profileUser1.email,
          firstName: profileUser1.firstName,
          globalUId: profileUser1.globalUId,
          isPWEmployee: profileUser1.isPWEmployee,
          lastName: profileUser1.lastName,
          ldapId: profileUser1.ldapId,
          majorBusinessUnitName: profileUser1.majorBusinessUnitName,
          majorDepartmentName: profileUser1.majorDepartmentName,
          nationality: profileUser1.nationality,
          rtxId: profileUser1.rtxId,
          telephoneNumber: profileUser1.telephoneNumber,
          workDayId: profileUser1.workDayId,

        }
      },
    });
    //console.log(profileUsers);
  }

  createInitials(datas) {
    let firstIntial = datas.displayName.slice(0, 1);
    let secondvalue = datas.displayName.split(' ')[1];
    let secondIntial = secondvalue?.slice(0, 1);
    this.finalInitial = firstIntial + secondIntial;
  }

  getProfile() {
    console.log("GetProfile Call");
    
    this.http.get(GRAPH_ENDPOINT).toPromise()
      .then(userData => {
        sessionStorage.setItem('EKSAdminGroupControl', "false");
        this.profile = userData;
        let userEmail = (this.profile) ? this.profile.mail : '';
        let userId = (this.profile) ? this.profile.id : '';
        let userDisplayName = (this.profile) ? this.profile.displayName : '';
        sessionStorage.setItem('userMail', userEmail);
        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('displayName', userDisplayName);
        localStorage.setItem('logInUserEmail', userEmail);
        this.userProfileObj = {
          id: (this.profile.id) ? this.profile.id : '',
          mail: (this.profile.mail) ? this.profile.mail : '',
          displayName: (this.profile.displayName) ? this.profile.displayName : "",
          businessPhones: (this.profile.businessPhones) ? this.profile.businessPhones : '',
          givenName: (this.profile.givenName) ? this.profile.givenName : '',
          mobilePhone: (this.profile.mobilePhone) ? this.profile.mobilePhone : '',
          officeLocation: (this.profile.officeLocation) ? this.profile.officeLocation : '',
          preferredLanguage: (this.profile.preferredLanguage) ? this.profile.preferredLanguage : '',
          surname: (this.profile.surname) ? this.profile.surname : '',
          userPrincipalName: (this.profile.userPrincipalName) ? this.profile.userPrincipalName : '',
          jobTitle: (this.profile.jobTitle) ? this.profile.jobTitle : ''
        };
        sessionStorage.setItem('userData', JSON.stringify(this.userProfileObj));
        this.createInitials(this.profile);
        this.profileDataService.getProfileData(userData);
        this.sharedData.getUserProfileByEmail(this.profile.mail, Constants.apiQueryString).subscribe((userProfileData) => {
          console.log("userProfileData response", userProfileData);
          /*This condition is required for contractor for content management authorization*/
          //console.log(' userProfileData',userProfileData);
          this.userProfileDataNew = userProfileData;
          let requesterClockId = (userProfileData.clockId) ? userProfileData.clockId : '';
          sessionStorage.setItem('requesterClockId', requesterClockId);
          if (userProfileData && userProfileData.isPWEmployee && userProfileData.eksgroupMembership) {
            sessionStorage.setItem('AADid', userProfileData.aadId);
            let eksgroupMembershipList: string[]
            if (userProfileData.isPWEmployee == environment.isPWContractor) {

              eksgroupMembershipList = userProfileData.eksgroupMembership.split(',');
              eksgroupMembershipList.forEach(elementcontractor => {
                if (elementcontractor == environment.pwEKSContentMgmtCAContrator) {
                  sessionStorage.setItem('EKSConentGroupControl', "true");
                  this.leftNavPanelShow.emit(true);
                } else if (elementcontractor == environment.pwEKSContentMgmtFNContrator) {
                  sessionStorage.setItem('EKSConentGroupControl', "true");
                  this.leftNavPanelShow.emit(true);
                } else if (elementcontractor == environment.pwEKSContentMgmtUSContrator) {
                  sessionStorage.setItem('EKSConentGroupControl', "true");
                  this.leftNavPanelShow.emit(true);
                }
              });

            } else {
              sessionStorage.setItem('EKSConentGroupControl', "true");
              this.leftNavPanelShow.emit(true);
            }
          } else {
            sessionStorage.setItem('EKSConentGroupControl', "true");
            this.leftNavPanelShow.emit(true);
          }
          /*This condition is required for authoring if user is contractor then outsourable flag should be true*/
          if (userProfileData && userProfileData.isPWEmployee) {
            (userProfileData.isPWEmployee == environment.isPWContractor) ? sessionStorage.setItem('EKSContractor', "true") : sessionStorage.setItem('EKSContractor', "false");
          }
          /*This condition is required for admin management authorization*/
          let eksgroupMembershipList: string[]
          if (userProfileData.eksgroupMembership) {
            eksgroupMembershipList = userProfileData.eksgroupMembership.split(',');
            eksgroupMembershipList.forEach(element => {
              if (element == environment.eksAdminGroup) {
                sessionStorage.setItem('EKSAdminGroupControl', "true");
                this.leftNavAdminPanelShow.emit(true);
              }
            });
          } else {
            sessionStorage.setItem('EKSAdminGroupControl', "true");
            this.leftNavAdminPanelShow.emit(true);
          }
          this.userProfileDataObj = {
            eksgroupMembership: (userProfileData.eksgroupMembership) ? userProfileData.eksgroupMembership : environment.eksContentManagementGroup + ',' + environment.eksAdminGroup,
            isPWEmployee: (userProfileData.isPWEmployee) ? userProfileData.isPWEmployee : 'HRLE',
            nationality: (userProfileData.nationality) ? userProfileData.nationality : 'USA',
            userEmail: (this.profile) ? this.profile.mail : '',
            globalUId: (userProfileData.globalUId) ? userProfileData.globalUId : '12345',
          };
          sessionStorage.setItem('userProfileData', JSON.stringify(this.userProfileDataObj));
          let userProfileDataObj = JSON.parse(sessionStorage.getItem('userProfileData'));
          //console.log("userProfileData user auth", userProfileDataObj);
          this.sharedData.setHeaderRequestedData(userProfileDataObj);
        });
      });
  }

}
