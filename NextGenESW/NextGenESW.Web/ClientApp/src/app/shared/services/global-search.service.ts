import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface PhaseTagSelection {
  phaseId?: string[],
  tags?: string[]
}

@Injectable({ providedIn: 'root' })
export class GlobalSearchService {
  sltCollectionsBSub = new BehaviorSubject<any[]>([]);
  sltPhaseTagsBSub = new BehaviorSubject<PhaseTagSelection>({})
}