import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FileUploader } from "ng2-file-upload";
import { MembersService } from "src/app/shared/services/members/members.service";
import { Member } from "src/app/shared/models/member.model";
import Auth from "@aws-amplify/auth";
import { AmplifyService } from "aws-amplify-angular";
import { AuthenticationService } from "src/app/shared/services/auth/authentication.service";
import { AppLoaderService } from 'src/app/shared/services/app-loader/app-loader.service';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { cplAnimations } from 'src/app/shared/animations/cpl-animations';
import { ProfileEditProfilePopupComponent } from './profile-edit-profile-popup/profile-edit-profile-popup.component';

@Component({
  selector: "app-profile-settings",
  templateUrl: "./profile-settings.component.html",
  styleUrls: ["./profile-settings.component.scss"],
  animations: [cplAnimations]
})
export class ProfileSettingsComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({ url: "upload_url" });
  public hasBaseDropZoneOver = false;

  public settingsForm: FormGroup;
  public passwordForm: FormGroup;
  private changePasswordForm: FormGroup;
  public preferencesForm: FormGroup;
  public member: Member;

  private passwordChangeReady = true;

  settingsReady = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loader: AppLoaderService,
    private membersService: MembersService,
    private amplifyService: AmplifyService,
    private auth: AuthenticationService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.auth.currentMember.subscribe(res => {
        this.member = res;
        this.settingsReady = true;
        this.initForm();
      });
  }

  private onFormChanges(): void {
    this.settingsForm.valueChanges.subscribe((val) => {
      console.log(val);
    });
  }

  private initForm(): void {
    this.settingsForm = this.fb.group({
      personalSettings: this.fb.group({
        firstName: [this.member.personal.firstName || "", Validators.required],
        lastName: [this.member.personal.lastName || "", Validators.required],
        email: [this.member.email || "", Validators.required],
        phone: [this.member.personal.phone || "", Validators.required],
        address: this.fb.group({
          street: ["", Validators.required],
          city: ["", Validators.required],
          province: ["", Validators.required],
          postal: ["", Validators.required],
          country: ["", Validators.required],
        }),
      }),
      profileSettings: this.fb.group({
        profilePicture: [this.member.profile.profilePicture || ""],
        tagline: [this.member.profile.tagline],
        description: [this.member.profile.description || ""],
      }),
    });
    this.passwordForm = this.fb.group({
      currentPassword: [""],
      newPassword: [""],
    });
    this.changePasswordForm = this.fb.group({
      oldPassword: ["", Validators.required],
      newPassword: ["", Validators.required],
    });
    this.preferencesForm = this.fb.group({
      test: [""],
    });
    this.onFormChanges();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  async updatePassword() {
    this.loader.open();
    this.passwordChangeReady = false;
    try {
      let user = await Auth.currentAuthenticatedUser();
      let result = await Auth.changePassword(
        user,
        this.changePasswordForm.get("oldPassword").value,
        this.changePasswordForm.get("newPassword").value
      );
      console.log(result);
      this.changePasswordForm.get('oldPassword').setValue('');
      this.changePasswordForm.get('newPassword').setValue('');
      this.passwordChangeReady = true;
      if (result === 'SUCCESS') {
        let message = "Password Changed";
        let action = "close";
        this._snackBar.open(message, action, {
          duration: 2000,
        });
      }
      this.loader.close();
    } catch (err) {
      console.log(err);
    }
  }

    openEditProfilePopup(data: any = {}, isNew?) {
    let title = isNew ? 'Add new card' : 'Update card';
    let dialogRef: MatDialogRef<any> = this.dialog.open(ProfileEditProfilePopupComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew }
    });
    dialogRef.afterClosed()
      .subscribe(res => {

        console.log(res);

        if(!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        if (isNew) {
            // add card
            this._snackBar.open('Card Added!', 'OK', { duration: 4000 });
            this.loader.close();
        } else {
            this._snackBar.open('Card Updated!', 'OK', { duration: 4000 });
            this.loader.close();
        }
      });
  }
}
