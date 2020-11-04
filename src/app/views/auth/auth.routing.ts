import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

export const AuthRoutes: Routes = [{
  path: '',
  children: [{
    path: 'forgot-password',
    component: ForgotPasswordComponent
  }, {
    path: 'login',
    component: LoginComponent
  }, {
    path: 'register',
    component: RegisterComponent
  }, {
    path: 'onboarding',
    component: OnboardingComponent
  }]
}];
