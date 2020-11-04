import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutPowerliftingComponent } from './about-powerlifting/about-powerlifting.component';
import { RouterModule } from '@angular/router';
import { AboutRoutes } from './about.routing';
import { AboutCplComponent } from './about-cpl/about-cpl.component';
import { AboutRulesComponent } from './about-rules/about-rules.component';
import { AboutOrganizationComponent } from './about-organization/about-organization.component';
import { AboutSponsorsComponent } from './about-sponsors/about-sponsors.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    AboutPowerliftingComponent,
    AboutCplComponent,
    AboutRulesComponent,
    AboutOrganizationComponent,
    AboutSponsorsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AboutRoutes),
    FlexLayoutModule
  ]
})
export class AboutModule { }
