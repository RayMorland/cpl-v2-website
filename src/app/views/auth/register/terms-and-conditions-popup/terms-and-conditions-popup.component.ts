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
import { LeagueService } from 'src/app/shared/services/league/league.service';
import { AppLoaderService } from 'src/app/shared/services/app-loader/app-loader.service';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';

@Component({
  selector: 'app-terms-and-conditions-popup',
  templateUrl: './terms-and-conditions-popup.component.html',
  styleUrls: ['./terms-and-conditions-popup.component.scss']
})
export class TermsAndConditionsPopupComponent implements OnInit {
  private invoice: any;
  private invoiceReady = false;
  private editMode = false;
  private loaderOpen = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TermsAndConditionsPopupComponent>,
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private changeDetectorRef: ChangeDetectorRef,
    private leagueService: LeagueService,
    private platformService: PlatformService
  ) {}

  ngOnInit() {

  }

  private getData(): Observable<any> {
    const invoice = [];
    return forkJoin([invoice]);
  }
}