import { Routes } from '@angular/router';
import { RecordsListComponent } from './records-list/records-list.component';

export const RecordsRoutes: Routes = [{
  path: '',
  children: [{
    path: '',
    component: RecordsListComponent
  }]
}];
