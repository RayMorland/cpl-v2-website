import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { RecordsService } from 'src/app/shared/services/records/records.service';
import { MeetsService } from 'src/app/shared/services/meets/meets.service';
import { Result } from 'src/app/shared/models/result.model';
import { ColumnMode } from "@swimlane/ngx-datatable";

@Component({
  selector: 'app-meet-results',
  templateUrl: './meet-results.component.html',
  styleUrls: ['./meet-results.component.scss']
})
export class MeetResultsComponent implements OnInit, OnDestroy {
  private paramsSub: Subscription;
  private dataSub: Subscription;
  private meetId: string;
  public results: Result[];
  public resultsReady = false;
  ColumnMode = ColumnMode;
  displayedColumns = [
    'name',
    'province',
    'weightClass',
    'weight',
    'age',
    'squat',
    'bench',
    'deadlift',
    'total',
    'wilks',
    'mcctotal'
  ];
  onResults = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private meetService: MeetsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.paramsSub = this.route.parent.params.subscribe((params: Params) => {
      console.log(params);
      if (params.hasOwnProperty('id')) {
        this.meetId = params.id;
        this.dataSub = this.getData(this.meetId).subscribe( res => {
          this.results = res[0];
          this.resultsReady = true;
          this.changeDetectorRef.detectChanges();
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.paramsSub.unsubscribe();
    this.dataSub.unsubscribe();
  }

  private getData(id: string): Observable<any> {
    const results = this.meetService.getMeetResults(id);
    return forkJoin([results]);
  }
}
