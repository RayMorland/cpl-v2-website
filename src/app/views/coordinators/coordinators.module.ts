import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoordinatorsListComponent } from './coordinators-list/coordinators-list.component';
import { RouterModule } from '@angular/router';
import { CoordinatorsRoutes } from './coordinators.routing';
import { CoordinatorsAboutComponent } from './coordinators-about/coordinators-about.component';
import { CoordinatorDetailComponent } from './coordinator-detail/coordinator-detail.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    CoordinatorsListComponent,
    CoordinatorsAboutComponent,
    CoordinatorDetailComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule.forChild(CoordinatorsRoutes)
  ]
})
export class CoordinatorsModule { }
