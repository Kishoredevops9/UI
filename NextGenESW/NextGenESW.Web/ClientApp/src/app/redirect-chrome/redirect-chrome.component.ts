import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LobbyHomeService } from '@app/lobby-home/lobby-home.service';
import * as ts from "typescript";

@Component({
  selector: 'app-redirect-chrome',
  templateUrl: './redirect-chrome.component.html',
  styleUrls: ['./redirect-chrome.component.scss'],
})

export class RedirectChromeComponent implements OnInit {

  feedbackForm: FormGroup;
  feedbackAlert: string = 'Feedback field is required';
  title = new FormControl;
  description = new FormControl;
  currentUserMail;
  currentUserName;
  elementValues;
  helpType;
  isBrowserIE:any;

  constructor( 
    private formBuilder: FormBuilder,
    public feedBackDialog: MatDialogRef<RedirectChromeComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private lobbyHomeService: LobbyHomeService

    ) { }
  
  ngOnInit() {


  }

  
  // openURL() 
  // {    var ActiveXObject: (type: string) => void;
  //      var shell = new ActiveXObject("WScript.Shell");
  //      shell.run("Chrome https://google.com");
  // } 
 
}
