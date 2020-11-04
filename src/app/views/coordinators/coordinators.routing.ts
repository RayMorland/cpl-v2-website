import { Routes } from '@angular/router';
import { CoordinatorsListComponent } from './coordinators-list/coordinators-list.component';
import { CoordinatorsAboutComponent } from './coordinators-about/coordinators-about.component';

export const CoordinatorsRoutes: Routes = [{
  path: '',
  children: [
    {
    path: '',
    component: CoordinatorsAboutComponent
  }
]
}];
