import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { News } from 'src/app/shared/models/news.model';
import { NewsService } from 'src/app/shared/services/news/news.service';

@Component({
  selector: 'app-news-article',
  templateUrl: './news-article.component.html',
  styleUrls: ['./news-article.component.scss']
})
export class NewsArticleComponent implements OnInit {

  article: News;
  articleReady = false;
  articleId: string;


  constructor(
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private newsService: NewsService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        if (params.hasOwnProperty('id')) {
          this.articleId = params.id;
          this.getData().subscribe(
            (res) => {
              console.log(res);
              this.article = res[0][0];
              console.log(this.article.content);
              this.articleReady = true;
              this.changeDetectorRef.detectChanges();
            }, err => {
              console.log(err);
            });
        } else {
        }
      }
    );
  }

  private getData(): Observable<any> {
    const article = this.newsService.findNews(this.articleId);
    return forkJoin([article]);
  }
}
