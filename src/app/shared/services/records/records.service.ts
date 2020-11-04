import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../auth/authentication.service';
import { environment } from '../../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Record } from '../../models/record.model';
import { PlatformService } from '../platform/platform.service';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class RecordsService {

  record: Record;

  constructor(
    private http: HttpClient,
    private platform: PlatformService
  ) { }

  public getRecords(): Observable<any> {
    return this.http.get(API_URL + '/getrecords', {});
  }
  public findRecord(RecordsId: string): Observable<any> {
    const params = new HttpParams().set('_id', RecordsId);
    return this.http.get(API_URL + '/findrecord', { params: params });
  }
  public createRecord(record: Record): Observable<any> {
    return this.http.post(API_URL + '/createrecord', { newRecord: record });
  }
  public updateRecord(id: string, record: Record): Observable<any> {
    return this.http.post(API_URL + '/updaterecord', { '_id': id, 'updatedRecord': record });
  }
  public deleteRecord(record: Record): Observable<any> {
    return this.http.post(API_URL + '/deleterecord', { deletedRecord: record });
  }
  public getResultFromRecord(record: Record): Observable<any> {
    return this.http.post(API_URL + '/getresultfromrecord', { 'record': record });
  }

  // public filterRecords(filterForm: any, records: Record[]): Record[] {
  //   let filteredRecords = [];
  //   const months = this.platform.months;
  //   filteredRecords = records.filter((record) => {
  //     if (record.level !== undefined) {
  //       if (
  //         filterForm.level == null ||
  //         filterForm.level === '' ||
  //         filterForm.level === record.level
  //       ) {
  //         if (record.gender !== undefined) {
  //           if (
  //             filterForm.gender == null ||
  //             filterForm.gender === '' ||
  //             filterForm.gender === record.gender
  //           ) {
  //             if (record.test !== undefined) {
  //               if (
  //                 filterForm.test == null ||
  //                 filterForm.test === '' ||
  //                 filterForm.test === record.test
  //               ) {
  //                 if (record.division !== undefined) {
  //                   if (
  //                     filterForm.division == null ||
  //                     filterForm.division === '' ||
  //                     filterForm.division === record.division
  //                   ) {
  //                     if (record.category !== undefined) {
  //                       if (
  //                         filterForm.category == null ||
  //                         filterForm.category === '' ||
  //                         filterForm.category === record.category
  //                       ) {
  //                         if (record.competition !== undefined) {
  //                           if (
  //                             filterForm.competition == null ||
  //                             filterForm.competition === '' ||
  //                             filterForm.competition === record.competition
  //                           ) {
  //                             return record;
  //                           }
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   });
  //   return filteredRecords;
  // }
}

