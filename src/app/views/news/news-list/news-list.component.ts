import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NewsService } from 'src/app/shared/services/news/news.service';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { News } from 'src/app/shared/models/news.model';
import { AppLoaderService } from 'src/app/shared/services/app-loader/app-loader.service';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit, OnDestroy {

  public filterForm: FormGroup;
  public news: News[];
  public newsReady = false;
  public currentPage: any;

  private dataSub: Subscription;

  public months = [];
  public years = [];
  public categories = [];

  constructor(
    private fb: FormBuilder,
    private newsService: NewsService,
    private changeDetectorRef: ChangeDetectorRef,
    private loader: AppLoaderService,
    private platform: PlatformService
  ) {
    this.months = this.platform.months;
   }

  ngOnInit() {
    this.buildFilterForm();
    this.dataSub = this.getData().subscribe( res => {
      this.newsReady = true;
      this.news = res[0];
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy() {
    this.dataSub.unsubscribe();
  }

  private getData(): Observable<any> {
    const news = this.newsService.getNews();
    return forkJoin([news]);
  }

  buildFilterForm() {
    this.filterForm = this.fb.group({
      search: [''],
      category: [''],
      year: [''],
      month: [''],
    });

    this.filterForm.valueChanges.subscribe( res => {
      this.filterNews();
    });
  }

  private filterNews(): void {
    console.log(this.filterForm.value);
  }

}
