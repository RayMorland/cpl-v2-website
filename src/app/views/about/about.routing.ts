import { Routes } from '@angular/router';
import { AboutPowerliftingComponent } from './about-powerlifting/about-powerlifting.component';
import { AboutCplComponent } from './about-cpl/about-cpl.component';
import { AboutRulesComponent } from './about-rules/about-rules.component';
import { AboutOrganizationComponent } from './about-organization/about-organization.component';
import { AboutSponsorsComponent } from './about-sponsors/about-sponsors.component';

export const AboutRoutes: Routes = [{
  path: '',
  children: [
    {
    path: '',
    component: AboutCplComponent
  }, {
    path: 'powerlifting',
    component: AboutPowerliftingComponent
  }, {
    path: 'rules',
    component: AboutRulesComponent
  }, {
    path: 'organization',
    component: AboutOrganizationComponent
  }, {
    path: 'sponsors',
    component: AboutSponsorsComponent
  },
]
}];
