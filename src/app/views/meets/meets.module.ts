import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetsListComponent } from './meets-list/meets-list.component';
import { RouterModule } from '@angular/router';
import { MeetsRoutes } from './meets.routing';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedMaterialModule } from 'src/app/shared/shared-material.module';
import { MeetDetailsComponent } from './meet-details/meet-details.component';
import { MeetResultsComponent } from './meet-results/meet-results.component';
import { MeetRegistrationComponent } from './meet-registration/meet-registration.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MeetInfoComponent } from './meet-info/meet-info.component';

@NgModule({
  declarations: [MeetsListComponent, MeetDetailsComponent, MeetResultsComponent, MeetRegistrationComponent, MeetInfoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedModule,
    SharedMaterialModule,
    SharedDirectivesModule,
    RouterModule.forChild(MeetsRoutes)
  ]
})
export class MeetsModule { }
