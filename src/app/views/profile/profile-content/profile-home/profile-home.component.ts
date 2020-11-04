import {
  Component,
  OnInit,
  ChangeDetectorRef,
  HostListener,
  OnDestroy,
} from "@angular/core";
import { forkJoin, Observable, Subscription } from "rxjs";
import { cplAnimations } from "src/app/shared/animations/cpl-animations";
import { Meet } from "src/app/shared/models/meet.model";
import { Member } from "src/app/shared/models/member.model";
import { NotificationService } from "src/app/shared/services/notifications/notification.service";
import { MeetsService } from "src/app/shared/services/meets/meets.service";
import { MembersService } from "src/app/shared/services/members/members.service";
import { AuthenticationService } from "src/app/shared/services/auth/authentication.service";
import { Registration } from 'src/app/shared/models/registration.model';

@Component({
  selector: "app-profile-home",
  templateUrl: "./profile-home.component.html",
  styleUrls: ["./profile-home.component.scss"],
  animations: [cplAnimations],
})
export class ProfileHomeComponent implements OnInit, OnDestroy {
  // Subscriptions
  private dataSub: Subscription;
  private meetSub: Subscription;

  public notifications: Notification[];
  public overviewReady = false;
  public membersMeets: Meet[] = [];
  public membersRegistrations: Registration[] = [];
  public member: Member;

  constructor(
    private notificationService: NotificationService,
    private meetsService: MeetsService,
    private memberService: MembersService,
    private changeDetectorRef: ChangeDetectorRef,
    private auth: AuthenticationService
  ) {
    // this.auth.currentMember.subscribe(res => {
    //   console.log(res);
    // });
  }

  ngOnInit() {
    this.auth.currentMember.subscribe((member) => {
      this.member = member;
      this.dataSub = this.getData().subscribe(
        (res) => {
          this.memberService.membersRegistrations(this.member._id).subscribe(registrations => {
            // this.membersMeets = this.memberService.membersMeets(meets, res[0]);
            this.membersRegistrations = registrations;
            this.membersMeets = this.membersRegistrations.map(reg => reg.meetId);
            this.notifications = res[1][0].notifications;
            this.overviewReady = true;
            this.changeDetectorRef.detectChanges();
          }, (err) => {
            console.log(err);
          });
        },
        (err) => {
          console.log(err);
        }
      );
    },
    (err) => {
      console.log(err);
    });
  }

  ngOnDestroy() {
    this.dataSub.unsubscribe();
  }

  private getData(): Observable<any> {
    const meets = this.meetsService.getMeets();
    const notifications = this.notificationService.getAllNotifications();
    return forkJoin([meets, notifications]);
  }

  public updateTimeline(): void {
    this.meetSub = this.notificationService.getAllNotifications().subscribe(
      (res) => {
        this.notifications = res;
        this.meetSub.unsubscribe();
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
