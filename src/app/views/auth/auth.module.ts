import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule } from '@angular/router';
import { AuthRoutes } from './auth.routing';
import { AuthComponent } from './auth.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { SharedMaterialModule } from 'src/app/shared/shared-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TermsAndConditionsPopupComponent } from './register/terms-and-conditions-popup/terms-and-conditions-popup.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    AuthComponent,
    TermsAndConditionsPopupComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    OnboardingModule,
    SharedMaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(AuthRoutes)
  ],
  entryComponents: [
    TermsAndConditionsPopupComponent
  ]
})
export class AuthModule { }
