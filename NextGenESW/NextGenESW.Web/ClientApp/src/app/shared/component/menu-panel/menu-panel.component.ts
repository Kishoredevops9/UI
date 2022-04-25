import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-left-menu-panel",
  templateUrl: "./menu-panel.component.html",
  styleUrls: ["./menu-panel.component.scss"]
})
export class MenuPanelComponent implements OnInit {
  @Input() disciplineItems: any;
  constructor() { }
  ngOnInit() { }
}
