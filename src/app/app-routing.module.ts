import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './shared/components/layouts/main-layout/main-layout.component';
import { AuthGuard } from './shared/services/auth/auth.guard';
import { AuthComponent } from './views/auth/auth.component';

export const rootRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./views/home/home.module').then(m => m.HomeModule),
        data: { title: 'Home' }
      },
      {
        path: 'profile',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./views/profile/profile.module').then(m => m.ProfileModule),
        data: { title: 'Profile' }
      },
      {
        path: 'about',
        loadChildren: () =>
          import('./views/about/about.module').then(m => m.AboutModule),
        data: { title: 'About' }
      },
      {
        path: 'news',
        loadChildren: () =>
          import('./views/news/news.module').then(m => m.NewsModule),
        data: { title: 'News' }
      },
      {
        path: 'meets',
        loadChildren: () =>
          import('./views/meets/meets.module').then(m => m.MeetsModule),
        data: { title: 'Meets' }
      },
      {
        path: 'memberships',
        loadChildren: () =>
          import('./views/memberships/memberships.module').then(
            m => m.MembershipsModule
          ),
        data: { title: 'Memberships' }
      },
      {
        path: 'members',
        loadChildren: () =>
          import('./views/members/members.module').then(
            m => m.MembersModule
          ),
        data: { title: 'Members' }
      },
      {
        path: 'coordinators',
        loadChildren: () =>
          import('./views/coordinators/coordinators.module').then(
            m => m.CoordinatorsModule
          ),
        data: { title: 'Coordinators' }
      },
      {
        path: 'records',
        loadChildren: () =>
          import('./views/records/records.module').then(m => m.RecordsModule),
        data: { title: 'Records' }
      },
      {
        path: 'search',
        loadChildren: () =>
          import('./views/search/search.module').then(m => m.SearchModule),
        data: { title: 'Search' }
      },
    ]
  },
  {
    canActivate: [AuthGuard],
    path: 'onboarding',
    loadChildren: () =>
      import('./views/auth/onboarding/onboarding.module').then(
        m => m.OnboardingModule
      ),
    data: { title: 'Onboarding' }
  },
  {
    path: '',
    loadChildren: () =>
      import('./views/auth/auth.module').then(m => m.AuthModule),
    data: { title: 'Auth' }
  },
  {
    path: '',
    loadChildren: () => import('./views/utility/utility.module').then(m => m.UtilityModule),
    data: { title: 'Utility' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(rootRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
