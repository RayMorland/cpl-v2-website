import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthenticationService } from "../auth/authentication.service";
import { environment } from "../../../../environments/environment";
import { FormGroup } from "@angular/forms";
import { Observable, Subscribable, Subscription } from "rxjs";
import { Member } from "../../models/member.model";
import { Meet } from "../../models/meet.model";
import { filter, map, tap } from "rxjs/operators";
import { Registration } from "../../models/registration.model";
import { constants } from "zlib";
const API_URL = environment.apiURL;

@Injectable({
  providedIn: "root",
})
export class MembersService {
  private member: Member;

  constructor(private http: HttpClient) {}

  public getMembers(): Observable<any> {
    return this.http.get(API_URL + "/getmembers", {});
  }

  public getMembersMembership(memberId: string): Observable<any> {
    const params = new HttpParams().set("_id", memberId);
    return this.http.get(API_URL + "/getmembersmembership", { params: params });
  }
  public findMember(search: any): Observable<any> {
    return this.http.get(API_URL + "/findmember", { params: search });
  }
  public createMember(member: Member): Observable<any> {
    return this.http.post(API_URL + "/createmember", { newMember: member });
  }
  public updateMember(id: string, member: Member): Observable<any> {
    return this.http.post(API_URL + "/updatemember", {
      _id: id,
      updatedMember: member,
    });
  }
  public registerMember(
    id: string,
    member: Member,
    paymentInfo: any
  ): Observable<any> {
    return this.http.post(API_URL + "/registermember", {
      _id: id,
      updatedMember: member,
      paymentInfo: paymentInfo,
    });
  }
  public deleteMember(member: Member): Observable<any> {
    return this.http.post(API_URL + "/deletemember", { deletedMember: member });
  }
  public getMembersRegistrations(MemberId: string): Observable<any> {
    const params = new HttpParams().set("_id", MemberId);
    return this.http.get(API_URL + "/getmembersregistrations", {
      params: params,
    });
  }

  public getMembersRecords(memberId: string): Observable<any> {
    return this.http.get(API_URL + "/getmembersrecords", {
      params: { _id: memberId },
    });
  }

  public setMember(member: Member) {
    this.member = member;
    window.sessionStorage.setItem("memberId", member._id);
  }

  public membersRegistrations(memberId: string): Observable<Registration[]> {
    return this.getMembersRegistrations(memberId).pipe(
      map((registration) => registration.map((reg) => reg))
    );
  }

  // public membersMeets(registrations: string[], meets: Meet[]): Meet[] {
  //   console.log(registrations);
  //   let membersMeets = [];
  //   registrations.forEach((reg) => {
  //     membersMeets.push(meets.find((meet) => meet._id === reg));
  //   });
  //   return membersMeets;
  // }

  public getMember(): Member {
    return this.member;
  }
}
