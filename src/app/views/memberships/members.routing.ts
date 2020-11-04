import { Routes } from '@angular/router';
import { MembershipsListComponent } from './memberships-list/memberships-list.component';
import { MembershipsPurchaseComponent } from './memberships-purchase/memberships-purchase.component';

export const MembershipRoutes: Routes = [{
  path: '',
  children: [
    {
    path: '',
    component: MembershipsListComponent
  }, {
    path: 'purchase',
    component: MembershipsPurchaseComponent
  },
]
}];
