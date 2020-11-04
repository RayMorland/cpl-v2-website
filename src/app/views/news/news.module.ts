import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsListComponent } from './news-list/news-list.component';
import { RouterModule } from '@angular/router';
import { NewsRoutes } from './news.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { SharedMaterialModule } from 'src/app/shared/shared-material.module';
import { NewsArticleComponent } from './news-article/news-article.component';

@NgModule({
  declarations: [
    NewsListComponent,
    NewsArticleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedModule,
    SharedMaterialModule,
    SharedDirectivesModule,
    RouterModule.forChild(NewsRoutes)
  ]
})
export class NewsModule { }
