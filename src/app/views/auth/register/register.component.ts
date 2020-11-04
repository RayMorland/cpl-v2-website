import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { CustomValidators } from "ng2-validation";
import { Router } from "@angular/router";
import { AmplifyService } from "aws-amplify-angular";
import Auth, { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { AuthState } from "aws-amplify-angular/dist/src/providers";
import { CognitoUser } from "@aws-amplify/auth";
import { environment } from "../../../../environments/environment";
import { MembersService } from "src/app/shared/services/members/members.service";
import { AuthenticationService } from "src/app/shared/services/auth/authentication.service";
import { AppLoaderService } from "src/app/shared/services/app-loader/app-loader.service";
import { User } from "src/app/shared/models/user.model";
import { cplAnimations } from "src/app/shared/animations/cpl-animations";
import { TermsAndConditionsPopupComponent } from './terms-and-conditions-popup/terms-and-conditions-popup.component';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
  animations: [cplAnimations],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  confirmForm: FormGroup;
  email = environment.confirm.email;

  public showSignUp = true;
  public showConfirm = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private router: Router,
    private memberService: MembersService,
    private amplifyService: AmplifyService,
    private loader: AppLoaderService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    if (!this.email) {
      this.router.navigate(["/register"]);
    } else {
      Auth.resendSignUp(this.email);
    }
    this.initForms();
  }

  private initForms() {
    const password = new FormControl("", Validators.required);
    const confirmPassword = new FormControl(
      "",
      CustomValidators.equalTo(password)
    );
    this.registerForm = this.fb.group({
      personal: this.fb.group({
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
      }),
      email: ["", [Validators.required, Validators.email]],
      password: "",
      confirmPassword: "",
      agreed: [false, Validators.required],
    });

    this.confirmForm = this.fb.group({
      email: [this.email, Validators.required, {disabled: false}],
      code: ["", [Validators.required, Validators.min(3)]],
    });
  }

  get emailInput() {
    return this.registerForm.get("email");
  }
  get passwordInput() {
    return this.registerForm.get("password");
  }
  get codeInput() {
    return this.confirmForm.get("code");
  }

  registerMember() {
    this.loader.open();
    if (!this.registerForm.invalid) {
      this.auth
        .signUp(this.registerForm.value)
        .then((user: CognitoUser | any) => {
          this.loader.close();
          console.log(user);
          environment.confirm.email = this.emailInput.value;
          environment.confirm.password = this.passwordInput.value;
          this.showConfirm = true;
          this.showSignUp = false;
          this.changeDetectorRef.detectChanges();
          // this.loader.close();
          // this.router.navigate(['/onboarding']);
        })
        .catch((error: any) => {
          this.loader.close();
          // this._notification.show(error.message);
          switch (error.code) {
            case "UserNotConfirmedException":
              environment.confirm.email = this.emailInput.value;
              environment.confirm.password = this.passwordInput.value;
              this.showConfirm = true;
              break;
            case "UsernameExistsException":
              this.router.navigate(["/login"]);
              break;
          }
        });
    } else {
      this.loader.close();
      console.log(this.registerForm.valid);
    }
  }

  sendAgain() {
    Auth.resendSignUp(this.email)
      .then(() => {
        // this._notification.show('A code has been emailed to you')
      })
      .catch(() => {
        // this._notification.show('An error occurred')
      });
  }

  confirmCode() {
    this.loader.open();
    Auth.confirmSignUp(
      this.confirmForm.controls["email"].value,
      this.codeInput.value
    )
      .then((data: any) => {
        this.loader.close();
        console.log(data);
        if (
          data === "SUCCESS" &&
          environment.confirm.email &&
          environment.confirm.password
        ) {
          Auth.signIn(
            this.confirmForm.controls["email"].value,
            environment.confirm.password
          )
            .then(() => {
              this.router.navigate(["/profile"]);
            })
            .catch((error: any) => {
              this.router.navigate(["/login"]);
            });
        }
      })
      .catch((error: any) => {
        this.loader.close();
        console.log(error);
        // this._notification.show(error.message);
      });
  }

  private openTermsAndConditionsPopup(data: any = {}, isNew?): void {
    let title = "Results";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      TermsAndConditionsPopupComponent,
      {
        width: "720px",
        disableClose: true,
        data: { isNew: isNew, result: data },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        // If user press cancel
        return;
      }
    });
  }
}
