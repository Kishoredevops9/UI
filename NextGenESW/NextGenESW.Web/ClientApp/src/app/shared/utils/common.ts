import { isEqual } from 'lodash';
import { Observable } from 'rxjs';

export function removeHTMLTags(str: string) {
  if (!str) return '';  
  return str.replace(/(<([^>]+)>)/gi, '');
}

export function isEqualVerify(source: any, target: any) {
  if (source == null || target == null) return isEqual(source, target);
  return JSON.stringify(source) === JSON.stringify(target);
}

export function formatDuration(value: string) {
  if (!value) return '';
  return value.replace(/(\..*)/g, '');
}

export function getSyncObservableValue(observable$: Observable<any>): any {
  let value: any;
  observable$.subscribe(item => value = item);
  return value;
}