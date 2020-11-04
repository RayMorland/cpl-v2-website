import { Component, OnInit, Inject, ChangeDetectorRef } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from "@angular/forms";
import { forkJoin, Observable } from "rxjs";
import { AppLoaderService } from 'src/app/shared/services/app-loader/app-loader.service';
import { LeagueService } from 'src/app/shared/services/league/league.service';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';
import { League } from 'src/app/shared/models/league.model';

@Component({
  selector: 'app-profile-edit-profile-popup',
  templateUrl: './profile-edit-profile-popup.component.html',
  styleUrls: ['./profile-edit-profile-popup.component.scss']
})
export class ProfileEditProfilePopupComponent implements OnInit {
  public invoiceReady = false;
  public editMode = false;
  public loaderOpen = false;
  private title;
  private league: League;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProfileEditProfilePopupComponent>,
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private changeDetectorRef: ChangeDetectorRef,
    private leagueService: LeagueService,
    private platformService: PlatformService
  ) {}

  ngOnInit() {
    this.title = this.data.title;
    console.log(this.data);
    this.league = this.data.league;
    this.changeDetectorRef.detectChanges();
  }
}