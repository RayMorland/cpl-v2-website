import { Routes } from '@angular/router';
import { MeetsListComponent } from './meets-list/meets-list.component';
import { MeetDetailsComponent } from './meet-details/meet-details.component';
import { MeetResultsComponent } from './meet-results/meet-results.component';
import { MeetRegistrationComponent } from './meet-registration/meet-registration.component';
import { MeetInfoComponent } from './meet-info/meet-info.component';
import { AuthGuard } from 'src/app/shared/services/auth/auth.guard';

export const MeetsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: MeetsListComponent
      },
      {
        path: ':id',
        component: MeetDetailsComponent,
        children: [
          {
            path: '',
            component: MeetInfoComponent
          }, {
            path: 'results',
            component: MeetResultsComponent
          },
        ]
      },
      {
        path: ':id/registration',
        canActivate: [AuthGuard],
        component: MeetRegistrationComponent
      },
      // {
      //   path: ':id/registration/:id2',
      //   canActivate: [AuthGuard],
      //   component: MeetRegistrationComponent
      // }
    ]
  }
];
