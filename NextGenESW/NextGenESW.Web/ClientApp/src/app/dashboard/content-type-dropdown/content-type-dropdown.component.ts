import { Router, Params, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-content-type-dropdown',
  templateUrl: './content-type-dropdown.component.html',
  styleUrls: ['./content-type-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContentTypeDropdownComponent implements OnInit {
  id;
  constructor(private router: Router, private ActivatedRoute: ActivatedRoute) {}

  contentCreateForm: FormGroup;

  ngOnInit(): void {
    this.contentCreateForm = new FormGroup({
      'content-type': new FormControl(null),
    });
  }

  list = [
    { name: 'Work Instruction (WI)', id: '1' },
    { name: 'Critieria Document (CD)', id: '2' },
    { name: 'Design Standards', id: '3' },
    { name: 'Design Manuals', id: '4' },
    { name: 'Map / Swim-lane Diagram', id: '5' },
    { name: 'Reference Doc', id: '6' },
    { name: 'Activity Page (AP)', id: '7' },
    { name: 'Video', id: '8' },
    { name: 'Task', id: '9' },
    { name: 'Knowledge Pack (TBD)', id: '10' },
  ];

  // Navigation funtion according to the item id
  onSelect(item) {
    if (item.id == '5') {
      this.router.navigate(['/process-maps']);
    } else if (item.id == '1') {
      this.router.navigate(['/create-document', item.id], {
        queryParams: { allowCreate: 'true' },
      });
    }
    else if (item.id == '7') {
      this.router.navigate(['/activity-page', item.id], {
        queryParams: { allowCreate: 'true' },
      });
  }
}
}
