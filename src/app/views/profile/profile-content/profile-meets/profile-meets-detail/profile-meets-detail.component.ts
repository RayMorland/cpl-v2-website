import { Component, OnInit, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { forkJoin, Observable, Subscriber, Subscription } from "rxjs";
import { Meet } from "src/app/shared/models/meet.model";
import { Member } from "src/app/shared/models/member.model";
import { Registration } from "src/app/shared/models/registration.model";
import { AppLoaderService } from "src/app/shared/services/app-loader/app-loader.service";
import { MeetsService } from "src/app/shared/services/meets/meets.service";
import { MembersService } from "src/app/shared/services/members/members.service";
import { AppConfirmService } from "src/app/shared/services/app-confirm/app-confirm.service";
import { ResultsService } from "src/app/shared/services/results/results.service";
import { CoordinatorsService } from "src/app/shared/services/coordinators/coordinators.service";
import { cplAnimations } from "src/app/shared/animations/cpl-animations";
import { AuthenticationService } from "src/app/shared/services/auth/authentication.service";
import { RegistrationService } from "src/app/shared/services/registrations/registration.service";
import { Result } from 'src/app/shared/models/result.model';

@Component({
  selector: "app-profile-meets-detail",
  templateUrl: "./profile-meets-detail.component.html",
  styleUrls: ["./profile-meets-detail.component.scss"],
  animations: [cplAnimations],
})
export class ProfileMeetsDetailComponent implements OnInit, OnDestroy {
  private dataSub: Subscription;
  private paramsSub: Subscription;

  public meet: Meet;
  public meetId: string;
  public meetReady = false;
  private member: Member;
  private registration: Registration;
  private registrationId: string;

  private registrations: Registration[] = [];

  private result: Result;

  constructor(
    private loader: AppLoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private meetService: MeetsService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private confirmService: AppConfirmService,
    private membersService: MembersService,
    private resultsService: ResultsService,
    private coordinatorService: CoordinatorsService,
    private auth: AuthenticationService,
    private registrationService: RegistrationService
  ) {}

  ngOnInit() {
    this.auth.currentMember.subscribe((res) => {
      this.member = res;
      this.paramsSub = this.route.params.subscribe(
        (params: Params) => {
          if (params.hasOwnProperty("id")) {
            this.registrationId = params.id;
            this.registrationService
              .findRegistration(this.registrationId)
              .subscribe((registration) => {
                this.registration = registration[0];
                this.meet = this.registration.meetId;
                console.log(this.registration);
                this.meetReady = true;
                this.changeDetectorRef.detectChanges();
                this.loader.close();
                if (this.registration.resultId != null) {
                  this.resultsService.findResult(this.registration.resultId).subscribe(result => {
                    console.log(result);
                    this.result = result;
                  });
                }
              });
          } else {
          }
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }

  ngOnDestroy() {
    // this.dataSub.unsubscribe();
    // this.paramsSub.unsubscribe();
  }

  private getData(): Observable<any> {
    const registrations = this.membersService.getMembersRegistrations(
      this.member._id
    );
    return forkJoin([registrations]);
  }
}
