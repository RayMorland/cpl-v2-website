import { Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ProfileHomeComponent } from './profile-content/profile-home/profile-home.component';
import { ProfileRecordsComponent } from './profile-content/profile-records/profile-records.component';
import { ProfileMembershipComponent } from './profile-content/profile-membership/profile-membership.component';
import { ProfileBillingComponent } from './profile-content/profile-billing/profile-billing.component';
import { ProfileMeetsComponent } from './profile-content/profile-meets/profile-meets.component';
import { ProfileSettingsComponent } from './profile-content/profile-settings/profile-settings.component';
import { AuthGuard } from 'src/app/shared/services/auth/auth.guard';
import { Component } from '@angular/core';
import { ProfileMeetsDetailComponent } from './profile-content/profile-meets/profile-meets-detail/profile-meets-detail.component';

export const ProfileRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ProfileComponent,
        children: [
          {
            path: '',
            component: ProfileHomeComponent,
          },
          {
            path: 'records',
            component: ProfileRecordsComponent,
          },
          {
            path: 'membership',
            component: ProfileMembershipComponent,
          },
          {
            path: 'billing',
            component: ProfileBillingComponent,
          },
          {
            path: 'meets',
            component: ProfileMeetsComponent,
          },
          {
            path: 'meets/:id',
            component: ProfileMeetsDetailComponent,
          },
          {
            path: 'settings',
            component: ProfileSettingsComponent,
          },
        ],
      },
    ],
  },
];
