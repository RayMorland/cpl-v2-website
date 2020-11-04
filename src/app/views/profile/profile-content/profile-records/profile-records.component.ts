import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { cplAnimations } from 'src/app/shared/animations/cpl-animations';
import { Result } from 'src/app/shared/models/result.model';
import { RecordsService } from 'src/app/shared/services/records/records.service';
import { MembersService } from 'src/app/shared/services/members/members.service';
import { Member } from 'src/app/shared/models/member.model';
import { LeagueService } from 'src/app/shared/services/league/league.service';

@Component({
  selector: 'app-profile-records',
  templateUrl: './profile-records.component.html',
  styleUrls: ['./profile-records.component.scss'],
  animations: [cplAnimations]
})
export class ProfileRecordsComponent implements OnInit, OnDestroy {

  // Subscriptions
  private dataSub: Subscription;
  private formChanges: Subscription;

  public member: Member;
  public filterForm: FormGroup;
  private membersRecords: Result[];
  private filteredRecords: Result[];
  public recordsReady = false;

  private divisions = [];
  private categories = [];
  private lifts = [];
  private tests = [];

  constructor(
    private fb: FormBuilder,
    private recordsService: RecordsService,
    private membersService: MembersService,
    private changeDetectorRef: ChangeDetectorRef,
    private league: LeagueService
  ) {
    this.divisions = league.divisions;
    this.categories = league.categories;
    this.lifts = league.lifts;
    this.tests = league.tests;
  }

  ngOnInit() {
    this.membersService.findMember({_id: window.localStorage.getItem('memberId')}).subscribe(res => {
      this.member = res;
      this.initForm();
      this.dataSub = this.getData().subscribe( res => {
        console.log(res);
        this.membersRecords = res[0];
        this.filteredRecords = this.membersRecords;
        this.recordsReady = true;
        this.changeDetectorRef.detectChanges();
      });
    });
  }

  ngOnDestroy() {
    this.dataSub.unsubscribe();
    this.formChanges.unsubscribe();
  }

  private getData(): Observable<any> {
    const records = this.membersService.getMembersRecords(this.member._id);
    return forkJoin([records]);
  }

  private onFormChanges(): void {
    this.formChanges = this.filterForm.valueChanges.subscribe( res => {
      console.log(res);
      this.filterRecords();
    });
  }

  private initForm() {
    this.filterForm = this.fb.group({
      search: [''],
      division: [''],
      category: [''],
      lift: [''],
      test: ['']
    });

    this.onFormChanges();
  }

  public filterRecords(): void {
    console.log(this.filterForm.value);
  }

}
