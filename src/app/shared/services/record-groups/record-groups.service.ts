import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../auth/authentication.service';
import { environment } from '../../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { RecordGroup } from '../../models/record-group.model';
import { PlatformService } from '../platform/platform.service';
const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class RecordGroupsService {

  ecordGroup: RecordGroup;

  constructor(
    private http: HttpClient,
    private platform: PlatformService
  ) { }

  public getRecordGroups(): Observable<any> {
    return this.http.get(API_URL + '/getrecordgroups', {});
  }
  public findRecordGroup(recordGroupsId: string): Observable<any> {
    const params = new HttpParams().set('_id', recordGroupsId);
    return this.http.get(API_URL + '/findrecordgroup', { params: params });
  }
  public createRecordGroup(recordGroup: RecordGroup): Observable<any> {
    return this.http.post(API_URL + '/createrecordgroup', { newRecordGroup: recordGroup });
  }
  public updateRecordGroup(id: string, recordGroup: RecordGroup): Observable<any> {
    return this.http.post(API_URL + '/updaterecordgroup', { '_id': id, 'updatedRecordGroup': recordGroup });
  }
  public deleteRecordGroup(recordGroup: RecordGroup): Observable<any> {
    return this.http.post(API_URL + '/deleterecordgroup', { deletedRecordGroup: recordGroup });
  }
  
  // public filterRecordGroups(filterForm: any, records: RecordGroup[]): RecordGroup[] {
  //   let filteredRecords = [];
  //   console.log(filterForm);
  //   filteredRecords = records.filter((record) => {
  //     console.log(record);
  //     if (record.level !== undefined) {
  //       if (
  //         filterForm.level == null ||
  //         filterForm.level === '' ||
  //         filterForm.level.toLowerCase() === record.level.toLowerCase()
  //       ) {
  //         if (record.gender !== undefined) {
  //           if (
  //             filterForm.gender == null ||
  //             filterForm.gender === '' ||
  //             filterForm.gender.toLowerCase()  === record.gender.toLowerCase()
  //           ) {
  //             if (record.drugTest !== undefined) {
  //               if (
  //                 filterForm.test == null ||
  //                 filterForm.test === '' ||
  //                 filterForm.test.toLowerCase()  === record.drugTest.toLowerCase()
  //               ) {
  //                 if (record.division !== undefined) {
  //                   if (
  //                     filterForm.division == null ||
  //                     filterForm.division === '' ||
  //                     filterForm.division.toLowerCase() === record.division.toLowerCase()
  //                   ) {
  //                     if (record.category !== undefined) {
  //                       if (
  //                         filterForm.category == null ||
  //                         filterForm.category === '' ||
  //                         filterForm.category.toLowerCase() === record.category.toLowerCase()
  //                       ) {
  //                         if (record.recordType !== undefined) {
  //                           if (
  //                             filterForm.competition == null ||
  //                             filterForm.competition === '' ||
  //                             filterForm.competition.toLowerCase() === record.recordType.toLowerCase()
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
