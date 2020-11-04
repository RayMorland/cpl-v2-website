import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../auth/authentication.service';
import { environment } from '../../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { League } from '../../models/league.model';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root',
})
export class LeagueService {
  league: League;

  public genders = [
    { gender: 'male', weightClasses: [50] },
    { gender: 'female', weightClasses: [55] },
  ];
  public levels = ['National', 'Provincial'];
  public categories = ['Classic Raw', 'Multi-Ply', 'Single-Ply', 'Raw'];
  public lifts = ['Full Power', 'Bench Only', 'Deadlift Only'];
  public tests = ['Tested', 'Untested'];
  public divisions = [
    { startAge: 13, endAge: 16, name: 'Junior' },
    { startAge: 13, endAge: 1000, name: 'Open' },
    { startAge: 35, endAge: 40, name: 'Sub-Master' },
    { startAge: 40, endAge: 1000, name: 'Master' },
  ];

  constructor(private http: HttpClient) {}

  public getLeague(): Observable<any> {
    return this.http.get(API_URL + '/getallleagues', {});
  }

  public updateLeague(id: string, league: League): Observable<any> {
    return this.http.post(API_URL + '/updateleague', {
      _id: id,
      updatedLeague: league,
    });
  }
}
