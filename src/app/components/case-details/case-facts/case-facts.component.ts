import {Component, Input, OnInit} from '@angular/core';
import {CaseDetails} from "../../../shared/types/supabase";

@Component({
  selector: 'app-case-facts',
  templateUrl: './case-facts.component.html',
  styleUrls: ['./case-facts.component.scss'],
  standalone: true
})
export class CaseFactsComponent  implements OnInit {
  @Input() caseDetails!: CaseDetails | undefined;

  constructor() { }

  ngOnInit() {}

}
