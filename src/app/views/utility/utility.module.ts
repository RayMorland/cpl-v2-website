import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { ErrorComponent } from './error/error.component';
import { UtilityRoutes } from './utility.routing';
import { SharedMaterialModule } from 'src/app/shared/shared-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { UtilityComponent } from './utility.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NotFoundComponent, ErrorComponent, UtilityComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedModule,
    SharedMaterialModule,
    SharedDirectivesModule,
    RouterModule.forChild(UtilityRoutes)
  ]
})
export class UtilityModule { }
