import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { RecordGroup } from "src/app/shared/models/record-group.model";
import { Observable, forkJoin } from "rxjs";
import { RecordGroupsService } from "src/app/shared/services/record-groups/record-groups.service";
import { RecordsService } from "src/app/shared/services/records/records.service";
import { AppLoaderService } from "src/app/shared/services/app-loader/app-loader.service";
import { LeagueService } from "src/app/shared/services/league/league.service";
import { Record } from "src/app/shared/models/record.model";
import { cplAnimations } from "src/app/shared/animations/cpl-animations";
import { League } from "src/app/shared/models/league.model";
import { ColumnMode } from "@swimlane/ngx-datatable";

@Component({
  selector: "app-records-list",
  templateUrl: "./records-list.component.html",
  styleUrls: ["./records-list.component.scss"],
  animations: [cplAnimations],
})
export class RecordsListComponent implements OnInit, OnDestroy {
  fullPowerDisplayedColumns = [
    "weightClass",
    "squat",
    "benchPress",
    "deadlift",
    "total",
  ];
  step = 0;
  ColumnMode = ColumnMode;
  public filterForm: FormGroup;
  public recordGroups: RecordGroup[] = [];
  public recordsReady = false;
  public unit = "metric";
  panelOpenState = false;
  public filteredRecords: Record[] = [];
  private records: Record[] = [];

  private league = new League();

  public filteredRecordGroups: RecordGroup[] = [];

  public levels = [];
  public genders = [];
  public divisions = [];
  public tests = [];
  public categories = [];
  public competitions = [];

  constructor(
    private fb: FormBuilder,
    private groupsService: RecordGroupsService,
    private recordsService: RecordsService,
    private changeDetectorRef: ChangeDetectorRef,
    private loader: AppLoaderService,
    private leagueService: LeagueService
  ) {
    this.genders = this.league.genders;
    this.divisions = this.league.divisions;
    this.tests = this.league.tests;
    this.categories = this.league.categories;
    this.competitions = this.league.events;
  }

  ngOnInit() {
    this.buildFilterForm();
    console.log(this.genders);
    // this.loader.open();
    this.getData().subscribe(
      (res) => {
        this.records = res[0];
        console.log(this.records);
        this.filteredRecords = this.records;
        this.buildGroups();
        this.filteredRecordGroups = this.recordGroups;
        this.recordsReady = true;
        this.changeDetectorRef.detectChanges();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ngOnDestroy() {}

  private getData(): Observable<any> {
    const records = this.recordsService.getRecords();
    return forkJoin([records]);
  }

  buildFilterForm() {
    this.filterForm = this.fb.group({
      level: [""],
      location: [""],
      gender: [""],
      division: [""],
      test: [""],
      category: [""],
      competition: [""],
    });

    this.filterForm.valueChanges.subscribe((res) => {
      this.recordsReady = false;
      // this.loader.open();
      this.filterRecords();
    });
  }

  private get level() {
    return this.filterForm.get("level");
  }
  private get location() {
    return this.filterForm.get("location");
  }
  private get gender() {
    return this.filterForm.get("gender");
  }
  private get division() {
    return this.filterForm.get("division");
  }
  private get test() {
    return this.filterForm.get("test");
  }
  private get category() {
    return this.filterForm.get("category");
  }
  private get competition() {
    return this.filterForm.get("competition");
  }

  private filterRecords(): void {
    // this.filteredRecordGroups = this.groupsService.filterRecordGroups(this.filterForm.value, this.recordGroups);
    // this.loader.close();

    console.log(this.filterForm.value, this.recordGroups);

    this.filteredRecordGroups = [];

    this.filteredRecordGroups = this.recordGroups.filter((group) => {
      if (
        (group.gender === this.gender.value || this.gender.value === '') &&
        (group.division.name === this.division.value || this.division.value === '') &&
        (group.test === this.test.value || this.test.value === '') &&
        (group.category === this.category.value || this.category.value === '') &&
        (group.recordType === this.competition.value || this.competition.value === '')
        ) {
        return group;
      }
    });

    this.recordsReady = true;
    console.log(this.filteredRecordGroups);
  }

  private buildGroups() {
    this.league.genders.forEach((gender) => {
      this.league.categories.forEach((cat) => {
        this.league.divisions.forEach((groupDivision) => {
          this.league.tests.forEach((test) => {
            this.league.events.forEach((event) => {
              const groupAgeClasses = [];
              groupDivision.ageClasses.forEach((gAgeClass, index) => {
                groupAgeClasses.push({
                  ageClass: gAgeClass,
                  weightClasses: []
                });
                gender.weightClasses.forEach(gWeightClass => {
                  groupAgeClasses[index].weightClasses.push({
                    weightClass: gWeightClass,
                    records: []
                  });
                });
              });

              this.recordGroups.push(
                new RecordGroup({
                  level: "National",
                  gender: gender.name,
                  test: test.type,
                  division: groupDivision,
                  ageClasses: groupAgeClasses,
                  category: cat,
                  recordType: event.type,
                })
              );
            });
          });
        });
      });
    });

    this.recordGroups.forEach((group, index) => {
      this.records.forEach((record) => {
        if (
          record.gender === group.gender &&
          record.category === group.category &&
          record.division.name === group.division.name &&
          record.event === group.recordType &&
          record.testing === group.test &&
          record.currentRecord
        ) {
          let yes = false;
          let i, j;

          group.ageClasses.forEach((aClass, index2) => {
            if (aClass.ageClass.min === record.division.ageClass.min) {
              aClass.weightClasses.forEach((wClass, index3) => {
                if (wClass.weightClass === record.weightClass) {
                  i = index2;
                  j =index3;
                  yes = true;
                }
              });
            }
          });
          if (yes) {
            this.recordGroups[index].ageClasses[i].weightClasses[j].records.push(record);
            yes = false;
          }
        }
      });
    });
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  scroll() {
    console.log('scroll');
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }
}
