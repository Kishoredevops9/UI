import { Component, Input, OnInit, ViewChild } from "@angular/core";

@Component({
  selector: "app-menu-item",
  templateUrl: "./user-help-menu.component.html",
  styleUrls: ["./user-help-menu.component.scss"]
})
export class UserHelpComponent implements OnInit {
  @Input() eksHelpList: any;
  @ViewChild("eksHelpMenu") public eksHelpMenu: any;
  constructor() {}
  ngOnInit() {}
}
