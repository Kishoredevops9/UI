import * as _ from 'lodash/fp';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

export const registerIcons = (
  iconRegistry: MatIconRegistry,
  domSanitizer: DomSanitizer,
  icons: string[]
) => {
  const iconsDir = '/assets/icons';
  _.forEach((icon: string) => {
    const path = domSanitizer.bypassSecurityTrustResourceUrl(
      `${iconsDir}/${icon}.svg`
    );
    iconRegistry.addSvgIconInNamespace('map-view', icon, path);
  })(icons);
}
