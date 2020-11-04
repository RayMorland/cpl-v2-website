import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersInfoComponent } from './members-info/members-info.component';
import { RouterModule } from '@angular/router';
import { MembersRoutes } from './members.routing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedMaterialModule } from 'src/app/shared/shared-material.module';

@NgModule({
  declarations: [
    MembersInfoComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedMaterialModule,
    RouterModule.forChild(MembersRoutes)
  ]
})
export class MembersModule { }
