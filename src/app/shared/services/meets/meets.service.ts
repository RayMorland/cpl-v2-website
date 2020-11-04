import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../api/api.service';
import { Meet } from '../../models/meet.model';
import { PlatformService } from '../platform/platform.service';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class MeetsService {

  public initialFilters = {
    minPrice: 10,
    maxPrice: 40,
    minRating: 1,
    maxRating: 5
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private apiService: ApiService,
    private platform: PlatformService
  ) { }

  public getMeets(): Observable<any> {
    return this.http.get(this.apiService.getUrl('getMeets'), {});
  }

  public findMeet(_id: string): Observable<any> {
    const params = new HttpParams().set('_id', _id);
    return this.http.get(API_URL + '/findmeet', { params: params });
  }

  public updateMeet(id: string, updatedMeet: any): Observable<any> {
    return this.http.post(API_URL + '/updatemeet', { id, updatedMeet });
  }

  public createMeet(newMeet: any): Observable<any> {
    return this.http.post(API_URL + '/createmeet', { newMeet });
  }

  public getFilteredMeets(filterForm: FormGroup): Observable<any> {
    return;
  }

  public getMeetRegistrants(meetId: string): Observable<any> {
    const params = new HttpParams().set('_id', meetId);
    return this.http.get(API_URL + '/getmeetregistrations', { params: params });
  }

  public getMeetResults(meetId: string): Observable<any> {
    const params = new HttpParams().set('_id', meetId);
    return this.http.get(API_URL + '/getmeetresults', { params: params });
  }

  public removeMeet(meetId: string): Observable<any> {
    return this.http.post(API_URL + '/removemeet', { meetId });
  }

  public filterMeets(filterForm: any, meets: Meet[]): Meet[] {
    let filteredMeets = [];
    const months = this.platform.months;
    filteredMeets = meets.filter((meet) => {
      if (meet.dates[0] !== undefined) {
        const date = new Date(meet.dates[0].start);
        if (
          filterForm.month == null ||
          filterForm.month === '' ||
          months[date.getMonth()] === filterForm.month
        ) {
          if (meet.venue.location.address.province !== undefined) {
            if (
              filterForm.province == null ||
              filterForm.province === '' ||
              meet.venue.location.address.province ===
                filterForm.province
            ) {
              if (meet.venue.location.address.province !== undefined) {
                if (
                  filterForm.coordinator == null ||
                  filterForm.coordinator === '' ||
                  meet.coordinator === filterForm.coordinator
                ) {
                  if (meet.venue.location.address.province !== undefined) {
                    if (
                      filterForm.year == null ||
                      filterForm.year === '' ||
                      months[date.getFullYear()] ===
                        filterForm.month
                    ) {
                      return meet;
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    return filteredMeets;
  }
}
