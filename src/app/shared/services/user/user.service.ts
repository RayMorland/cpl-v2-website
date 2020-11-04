import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../auth/authentication.service';
import { environment } from '../../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: User;

  constructor(
    private http: HttpClient
  ) { }

  public getUsers(): Observable<any> {
    return this.http.get(API_URL + '/getusers', {});
  }

  public getUsersUsership(userId: string): Observable<any> {
    const params = new HttpParams().set('_id', userId);
    return this.http.get(API_URL + '/getusersusership', { params: params });
  }
  public findUserByEmail(search: string): Observable<any> {
    const encodedSearch = encodeURIComponent(search);
    const params = new HttpParams().set('email', encodedSearch);
    return this.http.get(API_URL + '/finduserbyemail', { params: params });
  }
  public findUser(search: any): Observable<any> {
    return this.http.get(API_URL + '/finduser', { params: search });
  }
  public createUser(user: User, cognitoId): Observable<any> {
    return this.http.post(API_URL + '/createuser', { newUser: user, userType: 'member', cognito: cognitoId});
  }
  public updateUser(id: string, user: User): Observable<any> {
    return this.http.post(API_URL + '/updateuser', { '_id': id, 'updatedUser': user});
  }
  public registerUser(id: string, user: User, paymentInfo: any): Observable<any> {
    return this.http.post(API_URL + '/registeruser', { '_id': id, 'updatedUser': user, 'paymentInfo': paymentInfo});
  }
  public deleteUser(user: User): Observable<any> {
    return this.http.post(API_URL + '/deleteuser', { deletedUser: user});
  }
  public getUsersRegistrations(UserId: string): Observable<any> {
    const params = new HttpParams().set('_id', UserId);
    return this.http.get(API_URL + '/getusersregistrations', { params: params });
  }

  public getUsersRecords(userId: string): Observable<any> {
    return this.http.get(API_URL + '/getusersrecords', { params: { _id: userId }});
  }

  public setUser(user: User) {
    this.user = user;
    window.sessionStorage.setItem('userId', user._id);
  }

  public getUser(): User {
    return this.user;
  }
}