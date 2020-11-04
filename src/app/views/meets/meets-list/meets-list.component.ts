import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Observable, forkJoin, Subscription } from "rxjs";
import { Meet } from "src/app/shared/models/meet.model";
import { MeetsService } from "src/app/shared/services/meets/meets.service";
import { AuthenticationService } from "src/app/shared/services/auth/authentication.service";
import { AppLoaderService } from "src/app/shared/services/app-loader/app-loader.service";
import { Coordinator } from "src/app/shared/models/coordinator.model";
import { PlatformService } from "src/app/shared/services/platform/platform.service";
import { MembersService } from "src/app/shared/services/members/members.service";
import { Auth } from "aws-amplify";
import { Member } from "src/app/shared/models/member.model";
import { Router } from '@angular/router';
import { cplAnimations } from 'src/app/shared/animations/cpl-animations';
import { Registration } from 'src/app/shared/models/registration.model';

@Component({
  selector: "app-meets-list",
  templateUrl: "./meets-list.component.html",
  styleUrls: ["./meets-list.component.scss"],
  animations: [cplAnimations]
})
export class MeetsListComponent implements OnInit, OnDestroy {
  public filterForm: FormGroup;

  public meets: Meet[] = [];
  public filteredMeets: Meet[];

  private member: Member;
  membersMeets = [];
  private registrations: Registration[] = [];

  private dataSub: Subscription;
  public meetsReady = false;
  public currentPage: any;
  private loggedIn = false;

  public coordinators: Coordinator[];
  public years = [];
  public months = [];
  public provinces = [];

  constructor(
    private fb: FormBuilder,
    private meetsService: MeetsService,
    private memberService: MembersService,
    private changeDetectorRef: ChangeDetectorRef,
    public auth: AuthenticationService,
    public loader: AppLoaderService,
    public platform: PlatformService,
    private router: Router
  ) {
    this.provinces = platform.provinces;
    this.months = platform.months;
  }

  ngOnInit() {
    this.buildFilterForm();
    this.auth.$authState.subscribe(state => {
      this.meetsReady = false;
      console.log(state);
      if (state.state === "signedIn") {
        this.auth.currentMember.subscribe(member => {
          this.member = member;
          console.log(this.member);
          this.dataSub = this.getData().subscribe((res) => {
            this.meets = res[0];
            console.log(this.meets);
            this.registrations = res[1];
            console.log(this.registrations);
            if (this.auth.loggedIn) {
              this.membersMeets = res[1].map(registration => registration.meetId._id);
              console.log(this.member, this.membersMeets);
            }
            this.filteredMeets = this.meets;
            this.meetsReady = true;
            this.changeDetectorRef.detectChanges();
          });
        });
      } else {
        this.dataSub = this.getData().subscribe((res) => {
          this.meets = res[0];
          this.membersMeets = [];
          this.filteredMeets = this.meets;
          this.meetsReady = true;
          this.changeDetectorRef.detectChanges();
        });
      }
    });
  }

  ngOnDestroy() {
    this.dataSub.unsubscribe();
  }

  private getData(): Observable<any> {
    const meets = this.meetsService.getMeets();
    if (this.auth.loggedIn) {
      const registrations = this.memberService.membersRegistrations(this.member._id);
      return forkJoin([meets, registrations]);
    } else {
      return forkJoin([meets]);
    }
    // return forkJoin([meets]);
  }

  buildFilterForm() {
    this.filterForm = this.fb.group({
      search: [""],
      coordinator: [""],
      province: [""],
      year: [""],
      month: [""],
    });

    this.filterForm.valueChanges.subscribe((res) => {
      this.filterMeets();
    });
  }

  private filterMeets(): void {
    this.filteredMeets = this.meetsService.filterMeets(
      this.filterForm.value,
      this.meets
    );
    console.log(this.filteredMeets);
  }

  private navigate(link) {
    console.log(link);
    const reg = this.registrations.find(registration => registration.meetId._id === link);
    console.log(reg);
    this.router.navigate(['/profile/meets/' + reg._id]);
  }
}
