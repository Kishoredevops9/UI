import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-export-compliance',
  templateUrl: './export-compliance.component.html',
  styleUrls: ['./export-compliance.component.scss'],
})
export class ExportComplianceComponent implements OnInit {
  @Input() exportDialog: any;
  url = environment.ExportCompliance;
  safeSrc: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer) {
    this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  ngOnInit(): void {}
}
