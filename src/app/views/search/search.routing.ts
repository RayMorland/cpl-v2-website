import { Routes } from '@angular/router';
import { SearchComponent } from './search.component';

export const SearchRoutes: Routes = [{
  path: '',
  children: [{
    path: '',
    component: SearchComponent
  }]
}];
