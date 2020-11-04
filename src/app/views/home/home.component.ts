import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MeetsService } from 'src/app/shared/services/meets/meets.service';
import { NewsService } from 'src/app/shared/services/news/news.service';
import { Meet } from 'src/app/shared/models/meet.model';
import { News } from 'src/app/shared/models/news.model';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { cplAnimations } from 'src/app/shared/animations/cpl-animations';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    cplAnimations,
    trigger(
      'inOutAnimation', 
      [
        transition(
          ':enter', 
          [
            style({ opacity: 0 }),
            animate('1s ease-out',
                    style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1 }),
            animate('1s ease-in',
                    style({ opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  public meets: Meet[];
  public news: News[];
  public newsCarouselIndex = 0;
  public pageReady = false;
  public openMeets = 'upcoming';
  public upcomingMeets: Meet[] = [];
  public pastMeets: Meet[] = [];

  private dataSub: Subscription;
  private carouselTimer: any;

  constructor(
    private meetsService: MeetsService,
    private newsService: NewsService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.dataSub = this.getData().subscribe( res => {
      console.log(res);
      this.meets = res[0];

      this.meets.forEach( meet => {
        const now = new Date();
        if (meet.dates[0]) {
          const meetDate = new Date(meet.dates[0].start);
          if (meetDate < now) {
            this.pastMeets.push(meet);
          } else {
            this.upcomingMeets.push(meet);
          }
        }
      });
      this.news = res[1];
      this.pageReady = true;
      // this.startCarousel();
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy() {
    this.dataSub.unsubscribe();
  }

  private getData(): Observable<any> {
    const meetList = this.meetsService.getMeets();
    const newsList = this.newsService.getNews();
    return forkJoin([meetList, newsList]);
  }

  private startCarousel(): void {
    this.carouselTimer = setTimeout(() => {
      if (this.newsCarouselIndex === 3) {
        this.newsCarouselIndex = 0;
      } else {
        this.newsCarouselIndex++;
      }
      this.startCarousel();
    }, 5000);
  }

  public selectNews(index: number): void {
    clearTimeout(this.carouselTimer);
    this.newsCarouselIndex = index;
    // this.startCarousel();
  }

}
