import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, Subject, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import Auth, { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { Hub, ICredentials } from '@aws-amplify/core';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { MembersService } from '../members/members.service';
import { UserService } from '../user/user.service';
import { Member } from '../../models/member.model';
import { AmplifyService } from 'aws-amplify-angular';
const API_URL = environment.apiURL;

export interface UserDetails {
  _id: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

interface TokenResponse {
  // body: {
  token: string;
  user: any;
  // };
  // headers: {};
}

export interface TokenPayload {
  email: string;
  password: string;
  userType: string;
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public static SIGN_IN = 'signIn';
  public static SIGN_OUT = 'signOut';
  public static FACEBOOK = CognitoHostedUIIdentityProvider.Facebook;
  public static GOOGLE = CognitoHostedUIIdentityProvider.Google;
  private token: string;
  public loggedIn: boolean;
  public authState: BehaviorSubject<CognitoUser | any> = new BehaviorSubject<
    CognitoUser | any
  >({});
  $authState: Observable<CognitoUser | any> = this.authState.asObservable();

  public member: any;
  memberChange = new BehaviorSubject<any>(new Member());
  currentMember = this.memberChange.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private membersService: MembersService,
    private userService: UserService,
    private amplifyService: AmplifyService
  ) {
    amplifyService.authStateChange$.subscribe((authState) => {
      this.authState.next(authState);
      console.log(authState);

      switch (authState.state) {
        case 'signedIn':
          this.loggedIn = true;
          this.userService
          .findUser({ 'cognitoId': authState.user.username })
          .subscribe(
            (userRes) => {
              console.log(userRes);
              if (userRes.status === 'onboarding') {
                window.localStorage.setItem('userId', userRes._id);
                this.loggedIn = true;
              } else {
                this. membersService.findMember({ _id: userRes.typeId}).subscribe(member => {
                  this.changeMember(member);
                  this.member = member;
                  window.localStorage.setItem('memberId', member._id);
                  window.localStorage.setItem('userId', userRes._id);
                  this.loggedIn = true;
                });
              }
            },
            (err) => {
              console.error(err);
            }
          );
          break;
        case 'signedOut':
          this.loggedIn = false;
          break;
        default:
          this.loggedIn = false;
      }
    });
  }

  changeMember(member: Member) {
    this.memberChange.next(member);
  }

  public register(user: TokenPayload): Observable<any> {
    return this.http.post(API_URL + `/register`, user).pipe(
      map((data: TokenResponse) => {
        // Use data to set token, coordinator info, and login coordinator
        return data;
      }),
      catchError((e: Response) => throwError(e))
    );
  }

  public authenticate(token: any): Observable<any> {
    return this.http.post(
      API_URL + '/authenticate',
      { h: 'h' },
      { headers: { Authorization: token } }
    );
  }

  public signIn(
    username: string,
    password: string
  ): Promise<CognitoUser | any> {
    return new Promise((resolve, reject) => {
      Auth.signIn(username, password)
        .then((user: CognitoUser | any) => {
          this.userService
            .findUserByEmail(user.attributes.email)
            .subscribe(
              (userRes) => {
                console.log(userRes);
                if (userRes.status === 'onboarding') {
                  window.localStorage.setItem('userId', userRes._id);
                  this.loggedIn = true;
                  this.router.navigate(['/onboarding']);
                  resolve(user);
                } else {
                  this. membersService.findMember({ _id: userRes.typeId}).subscribe(member => {
                    this.changeMember(member);
                    console.log(this.memberChange.getValue());
                    this.member = member;
                    window.localStorage.setItem('memberId', member._id);
                    window.localStorage.setItem('userId', userRes._id);
                    this.loggedIn = true;
                    this.router.navigate(['/profile']);
                    resolve(user);
                  }, (err) => {
                    console.error(err);
                    reject(err);
                  });
                }
              },
              (err) => {
                console.error(err);
                reject(err);
              }
            );
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  public signUp(newMember: any): Promise<CognitoUser | any> {
    return new Promise((resolve, reject) => {
      Auth.signUp(newMember.email, newMember.password)
        .then((user: CognitoUser | any) => {
          const member = newMember;
          this.userService.createUser(member, user.userSub).subscribe(
            (res) => {
              // this.changeUser(res[0]);
              console.log(res);
              window.localStorage.setItem('userId', res.newUser._id);
              this.loggedIn = true;
              resolve(user);
            },
            (err) => {
              console.error(err);
              reject(err);
            }
          );
        })
        .catch((error: any) => {
          console.log(error);
          reject(error);
        });
    });
  }

  public signOut(): Promise<any> {
    return Auth.signOut().then(() => {
      this.loggedIn = false;
      window.localStorage.removeItem('userId');
      window.localStorage.removeItem('memberId');
      if (this.router.url.includes('profile') || this.router.url.includes('onboarding')) {
        this.router.navigate(['/login']);
      }
    });
  }

  public socialSignIn(
    provider: CognitoHostedUIIdentityProvider
  ): Promise<ICredentials> {
    return Auth.federatedSignIn({
      provider: provider,
    });
  }

  public loggedInMember(): Promise<any> {
    return new Promise((resolve, reject) => {
      Auth.currentAuthenticatedUser()
        .then((res) => {
          this.userService
            .findUser({ _id: window.localStorage.getItem('userId') })
            .subscribe((user) => {
              resolve(user);
            });
        })
        .catch((res) => {
          reject(res);
        });
    });
  }

  public loggedInUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      Auth.currentAuthenticatedUser()
        .then((res) => {
          this.userService
            .findUser({ _id: window.localStorage.getItem('userId') })
            .subscribe((user) => {
              resolve(user);
            });
        })
        .catch((res) => {
          reject(res);
        });
    });
  }

  // public get member() {
  //   return this._member;
  // }

  // public set member(member) {
  //   this._member = member;
  // }
}
