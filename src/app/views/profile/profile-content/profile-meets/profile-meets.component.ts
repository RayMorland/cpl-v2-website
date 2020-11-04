import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSnackBar, MatSidenav } from '@angular/material';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { cplAnimations } from 'src/app/shared/animations/cpl-animations';
import { Meet } from 'src/app/shared/models/meet.model';
import { ShopService } from 'src/app/shared/services/shop.service';
import { AppLoaderService } from 'src/app/shared/services/app-loader/app-loader.service';
import { LeagueService } from 'src/app/shared/services/league/league.service';
import { MembersService } from 'src/app/shared/services/members/members.service';
import { MeetsService } from 'src/app/shared/services/meets/meets.service';
import { RegistrationService } from 'src/app/shared/services/registrations/registration.service';
import { Coordinator } from 'src/app/shared/models/coordinator.model';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { Member } from 'src/app/shared/models/member.model';
import { Registration } from 'src/app/shared/models/registration.model';

@Component({
  selector: 'app-profile-meets',
  templateUrl: './profile-meets.component.html',
  styleUrls: ['./profile-meets.component.scss'],
  animations: [cplAnimations]
})
export class ProfileMeetsComponent implements OnInit, OnDestroy {
  public isSideNavOpen: boolean;
  public viewMode = 'grid-view';
  public currentPage: any;
  @ViewChild(MatSidenav, {static: false}) private sideNav: MatSidenav;

  public filteredMeets: Meet[] = [];
  private member: Member;

  private dataSub: Subscription;
  public meets: Meet[] = [];
  public meetsReady = false;
  public categories$: Observable<any>;
  public activeCategory = 'all';
  public filterForm: FormGroup;
  public meetsList: Meet[] = [];
  private membersMeets: Meet[] = [];

  public coordinators: Coordinator[];
  public years = [];
  public months = [];
  public provinces = [];

  public meetRegistrations: Registration[] = [];

  constructor(
    private shopService: ShopService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,
    private leagueService: LeagueService,
    private memberService: MembersService,
    private registrationService: RegistrationService,
    private meetService: MeetsService,
    public platform: PlatformService,
    private auth: AuthenticationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.provinces = platform.provinces;
    this.months = platform.months;
    this.auth.currentMember.subscribe(res => {
      this.member = res;
    });
  }

  ngOnInit() {
    this.buildFilterForm();
    // this.loader.open();
    this.auth.currentMember.subscribe((member) => {
      this.member = member;
      this.dataSub = this.getData().subscribe(
        (res) => {
          this.memberService.membersRegistrations(this.member._id).subscribe(registrations => {
            console.log(registrations);
            // this.membersMeets = this.memberService.membersMeets(meets, res[0]);
            this.meetRegistrations = registrations;
            this.membersMeets = registrations.map(registration => registration.meetId);
            console.log(this.membersMeets);
            this.filteredMeets = this.membersMeets;
            this.meetsReady = true;
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
    const league = this.leagueService.getLeague();
    const registrations = this.memberService.getMembersRegistrations(window.localStorage.getItem('memberId'));
    const meets = this.meetService.getMeets();
    return forkJoin([league, registrations, meets]);
  }

  buildFilterForm() {
    this.filterForm = this.fb.group({
      // search: [''],
      coordinator: [''],
      province: [''],
      year: [''],
      month: [''],
    });

    this.filterForm.valueChanges.subscribe((res) => {
      this.filterMeets();
    });
  }
  setActiveCategory(category) {
    this.activeCategory = category;
    this.filterForm.controls['category'].setValue(category);
  }

  toggleSideNav() {
    this.sideNav.opened = !this.sideNav.opened;
  }

  private filterMeets(): void {
    this.filteredMeets = this.meetService.filterMeets(this.filterForm.value, this.meets);
    console.log(this.filteredMeets);
  }

  private downloadRegistration(): void {

  }
}
