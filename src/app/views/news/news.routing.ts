import { Routes } from '@angular/router';
import { NewsListComponent } from './news-list/news-list.component';
import { NewsArticleComponent } from './news-article/news-article.component';

export const NewsRoutes: Routes = [{
  path: '',
  children: [
    {
    path: '',
    component: NewsListComponent
  }, {
    path: ':id',
    component: NewsArticleComponent
  }
]
}];
