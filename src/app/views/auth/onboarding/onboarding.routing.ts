import { Routes } from '@angular/router';
import { OnboardingWizardComponent } from './onboarding-wizard/onboarding-wizard.component';

export const OnboardingRoutes: Routes = [{
  path: '',
  children: [{
    path: '',
    component: OnboardingWizardComponent
  }]
}];
