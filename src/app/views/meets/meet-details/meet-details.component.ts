import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Meet } from "src/app/shared/models/meet.model";
import { MeetsService } from "src/app/shared/services/meets/meets.service";
import { forkJoin, Observable } from "rxjs";
import { Location } from "@angular/common";
import { AppLoaderService } from "src/app/shared/services/app-loader/app-loader.service";
import { MembersService } from "src/app/shared/services/members/members.service";
import { AuthenticationService } from "src/app/shared/services/auth/authentication.service";
import { Member } from "src/app/shared/models/member.model";
import { Registration } from 'src/app/shared/models/registration.model';
import { Result } from 'src/app/shared/models/result.model';

@Component({
  selector: "app-meet-details",
  templateUrl: "./meet-details.component.html",
  styleUrls: ["./meet-details.component.scss"],
})
export class MeetDetailsComponent implements OnInit {
  meet: Meet;
  meetReady = false;
  meetId: string;
  onResults = false;
  membersMeets: string[] = [];
  member: Member;
  registrations: Registration[] = [];
  results: Result[] = [];

  constructor(
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private meetService: MeetsService,
    private router: Router,
    private location: Location,
    private loader: AppLoaderService,
    private memberService: MembersService,
    private auth: AuthenticationService
  ) {
    router.events.subscribe((val) => {
      const path = location.path();
      if (path.includes("results")) {
        this.onResults = true;
        this.changeDetectorRef.detectChanges();
      } else {
        this.onResults = false;
        this.changeDetectorRef.detectChanges();
      }
      console.log(this.onResults);
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params.hasOwnProperty("id")) {
        this.meetId = params.id;
        if (this.auth.loggedIn) {
          this.auth.currentMember.subscribe((member) => {
            this.member = member;
            this.getData().subscribe(
              (res) => {
                console.log(res);
                this.meet = res[0][0];
                this.results = res[1];
                this.loader.close();
                this.memberService.membersRegistrations(this.member._id).subscribe(registrations => {
                  this.registrations = registrations;
                  this.membersMeets = registrations.map(registration => registration.meetId._id);
                  this.meetReady = true;
                  this.changeDetectorRef.detectChanges();
                });
              },
              (err) => {
                console.log(err);
              }
            );
          });
        } else {
          this.getData().subscribe(
            (res) => {
              console.log(res);
              this.meet = res[0][0];
              this.results = res[1];
              this.loader.close();
              console.log(this.membersMeets);
              this.meetReady = true;
              this.changeDetectorRef.detectChanges();
            },
            (err) => {
              console.log(err);
            }
          );
        }
      } else {
      }
    });
  }

  private getData(): Observable<any> {
    const meet = this.meetService.findMeet(this.meetId);
    const results = this.meetService.getMeetResults(this.meetId);
    return forkJoin([meet, results]);
  }

  private navigate(link) {
    console.log(link);
    const reg = this.registrations.find(
      (registration) => registration.meetId._id === link
    );
    console.log(reg);
    this.router.navigate(["/profile/meets/" + reg._id]);
  }
}
