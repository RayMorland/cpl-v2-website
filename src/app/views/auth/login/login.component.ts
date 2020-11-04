import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Router } from '@angular/router';
import { AmplifyService } from 'aws-amplify-angular';
import Auth, { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { AuthState } from 'aws-amplify-angular/dist/src/providers';
import { CognitoUser } from '@aws-amplify/auth';
import { environment } from '../../../../environments/environment';
import { MembersService } from 'src/app/shared/services/members/members.service';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { AppLoaderService } from 'src/app/shared/services/app-loader/app-loader.service';
import { cplAnimations } from 'src/app/shared/animations/cpl-animations';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [cplAnimations]
})
export class LoginComponent implements OnInit {
  signinForm: FormGroup;
  changePasswordForm: FormGroup;
  forgottenEmailForm: FormGroup;
  confirmUserForm: FormGroup;
  forgottenPasswordForm: FormGroup;
  signedIn: boolean;
  user: any;
  greeting: string;
  usernameAttributes = 'email';
  signUpConfig = {
    hideAllDefaults: true,
  };

  public authState: AuthState;
  public newUser: any;
  public state: any;
  public showSigninForm = true;
  public showGetVerificationCode = false;
  public showChangePasswordForm = false;
  public showForgottenPasswordForm = false;
  public showConfirmUser = false;
  public username: string;

  public email = '';
  private password = '';

  get emailInput() {
    return this.signinForm.get('email');
  }
  get passwordInput() {
    return this.signinForm.get('password');
  }

  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private router: Router,
    private memberService: MembersService,
    private amplifyService: AmplifyService,
    private loader: AppLoaderService,
    private userService: UserService
  ) {
    this.authState = {
      user: null,
      state: 'signIn',
    };

    this.amplifyService.setAuthState(this.authState);

    this.amplifyService.authStateChange$.subscribe((authState) => {
      this.state = authState.state;
      this.newUser = authState.user;
      console.log(this.state);
      if (this.state === 'requireNewPassword') {
        this.showSigninForm = false;
        this.showChangePasswordForm = true;
      }
      if (this.newUser) {
        this.username = this.newUser.username;
      }

      if (this.state === 'confirmSignUp') {
        this.authState = {
          user: authState.user,
          state: 'confirmSignUp',
        };
        this.showConfirmUser = true;
        this.showSigninForm = false;
      }

      if (this.state === 'signIn') {
      }
    });
  }

  ngOnInit() {
    this.initForms();
  }

  private initForms(): void {
    const password = new FormControl('', Validators.required);
    const confirmPassword = new FormControl(
      '',
      CustomValidators.equalTo(password)
    );

    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: '',
    });

    this.forgottenEmailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.changePasswordForm = this.fb.group({
      code: ['', [Validators.required]],
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
    });

    this.forgottenPasswordForm = this.fb.group({
      code: ['', [Validators.required]],
      newPassword: ['', Validators.required],
    });

    this.confirmUserForm = this.fb.group({
      code: ['', [Validators.required]],
    });
  }

  // Need to check if membership has expired upon login

  public signIn() {
    console.log(this.signinForm.value.email);
    this.loader.open();
    this.auth
      .signIn(this.signinForm.value.email, this.signinForm.value.password)
      .then((user: CognitoUser | any) => {
        this.loader.close();
        this.router.navigate(['/profile']);
      })
      .catch((error: any) => {
        this.loader.close();
        // this._notification.show(error.message);
        switch (error.code) {
          case 'UserNotConfirmedException':
            console.log(error);
            environment.confirm.email = this.emailInput.value;
            environment.confirm.password = this.passwordInput.value;
            this.showConfirmUser = true;
            this.showSigninForm = false;
            break;
          case 'UsernameExistsException':
            this.router.navigate(['/login']);
            break;
          case 'requireNewPassword':
            this.showSigninForm = false;
            this.showChangePasswordForm = true;
            break;
        }
      });
  }

  public resetPassword(): void {
    this.showSigninForm = false;
    this.showGetVerificationCode = true;
  }

  async getVerificationCode() {
    const email = this.forgottenEmailForm.controls['email'].value;
    console.log(email);
    this.loader.open();
    try {
      const confirm = await Auth.forgotPassword(email);
      this.showGetVerificationCode = false;
      this.showForgottenPasswordForm = true;
      this.loader.close();
    } catch (err) {
      console.log(err);
    }
  }

  async updatePassword() {
    this.loader.open();
    try {
      if (this.state === 'requireNewPassword') {
        const result = await Auth.completeNewPassword(
          this.newUser,
          this.changePasswordForm.controls['newPassword'].value,
          {}
        );
        this.loader.close();
        this.router.navigate(['/profile']);
        console.log(result);
      } else {
        console.log(this.forgottenEmailForm.controls['email'].value, this.forgottenPasswordForm.value);
        const result = await Auth.forgotPasswordSubmit(
          this.forgottenEmailForm.controls['email'].value,
          this.forgottenPasswordForm.controls['code'].value,
          this.forgottenPasswordForm.controls['newPassword'].value
        );
        this.auth
        .signIn(this.forgottenEmailForm.controls['email'].value, this.forgottenPasswordForm.controls['newPassword'].value)
        .then((user: CognitoUser | any) => {
          this.loader.close();
          this.router.navigate(['/profile']);
        })
        .catch((error: any) => {
          this.loader.close();
          // this._notification.show(error.message);
          switch (error.code) {
            case 'UserNotConfirmedException':
              console.log(error);
              environment.confirm.email = this.emailInput.value;
              environment.confirm.password = this.passwordInput.value;
              this.showConfirmUser = true;
              this.showSigninForm = false;
              break;
            case 'UsernameExistsException':
              this.router.navigate(['/login']);
              break;
            case 'requireNewPassword':
              this.showSigninForm = false;
              this.showChangePasswordForm = true;
              break;
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  confirmUser() {
    console.log(      this.signinForm.controls['email'].value,
    this.confirmUserForm.controls['code'].value);
    Auth.confirmSignUp(
      this.signinForm.controls['email'].value,
      this.confirmUserForm.controls['code'].value
    )
      .then((data: any) => {
        console.log(data);
        if (
          data === 'SUCCESS' &&
          environment.confirm.email &&
          environment.confirm.password
        ) {
          this.auth.signIn(this.signinForm.controls['email'].value, this.signinForm.controls['password'].value);
          // Auth.signIn(
          //   this.signinForm.controls['email'].value,
          //   environment.confirm.password
          // ).then(() => {
          //     this.userService
          //       .findUser({ email: this.signinForm.controls['email'].value })
          //       .subscribe((res) => {
          //         console.log(res);
          //         window.localStorage.setItem('userId', res._id);
          //         this.router.navigate(['']);
          //       });
          //   })
          //   .catch((error: any) => {
          //     this.router.navigate(['/login']);
          //   });
        }
      })
      .catch((error: any) => {
        console.log(error);
        // this._notification.show(error.message);
      });
  }

  async resendCode() {
    try {
      await Auth.resendSignUp(this.signinForm.controls['email'].value);
      console.log('code resent succesfully');
    } catch (err) {
      console.log('error resending code: ', err);
    }
  }

  async resendForgotPasswordCode() {
    try {
      await Auth.forgotPassword(this.forgottenEmailForm.controls['email'].value);
      console.log('code resent succesfully');
    } catch (err) {
      console.log('error resending code: ', err);
    }
  }
}
