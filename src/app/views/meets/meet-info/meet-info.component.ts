import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Meet } from 'src/app/shared/models/meet.model';
import { MeetsService } from 'src/app/shared/services/meets/meets.service';
import { forkJoin, Observable } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-meet-info',
  templateUrl: './meet-info.component.html',
  styleUrls: ['./meet-info.component.scss']
})
export class MeetInfoComponent implements OnInit {
  meet: Meet;
  meetReady = false;
  meetId: string;
  onResults = false;

  constructor(
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private meetService: MeetsService,
    private router: Router,
    private location: Location
  ) {
    router.events.subscribe(val => {
      const path = location.path();
      if (path.includes('results')) {
        this.onResults = true;
      } else {
        this.onResults = false;
      }
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params.hasOwnProperty('id')) {
        this.meetId = params.id;
        this.getData().subscribe(
          res => {
            console.log(res);
            this.meet = res[0][0];
            this.meetReady = true;
            this.changeDetectorRef.detectChanges();
          },
          err => {
            console.log(err);
          }
        );
      } else {
      }
    });
  }

  private getData(): Observable<any> {
    const meet = this.meetService.findMeet(this.meetId);
    return forkJoin([meet]);
  }
}
