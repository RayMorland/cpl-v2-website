import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedMaterialModule } from 'src/app/shared/shared-material.module';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { RouterModule } from '@angular/router';
import { SearchRoutes } from './search.routing';

@NgModule({
  declarations: [
    SearchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedModule,
    SharedMaterialModule,
    SharedDirectivesModule,
    RouterModule.forChild(SearchRoutes)
  ]
})
export class SearchModule { }
