import { Routes } from '@angular/router';
import { MembersInfoComponent } from './members-info/members-info.component';

export const MembersRoutes: Routes = [{
  path: '',
  children: [{
    path: '',
    component: MembersInfoComponent
  }]
}];
