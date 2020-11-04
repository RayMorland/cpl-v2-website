import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { SearchModule } from '../search/search.module';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedPipesModule } from '../pipes/shared-pipes.module';
import { SharedDirectivesModule } from '../directives/shared-directives.module';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { RouterModule } from '@angular/router';
import { TopHeaderComponent } from './top-header/top-header.component';
import { SharedMaterialModule } from '../shared-material.module';
import { MainFooterComponent } from './main-footer/main-footer.component';
import { AppComfirmComponent } from '../services/app-confirm/app-confirm.component';
import { AppLoaderComponent } from '../services/app-loader/app-loader.component';
import { RegisterButtonComponent } from './register-button/register-button.component';

const components = [
  MainLayoutComponent,
  TopHeaderComponent,
  MainFooterComponent,
  AppComfirmComponent,
  AppLoaderComponent,
  RegisterButtonComponent
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    PerfectScrollbarModule,
    SharedMaterialModule,
    SearchModule,
    SharedPipesModule,
    SharedDirectivesModule,
    RouterModule
  ],
  exports: components,
  entryComponents: [
    AppComfirmComponent,
    AppLoaderComponent
  ],
})
export class SharedComponentsModule { }
