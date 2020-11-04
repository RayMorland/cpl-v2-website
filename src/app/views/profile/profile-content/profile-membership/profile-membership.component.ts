import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Observable, forkJoin } from "rxjs";
import {
  MatDialog,
  MatSnackBar,
  MatSlideToggleChange,
  MatDialogRef,
} from "@angular/material";
import { cplAnimations } from "src/app/shared/animations/cpl-animations";
import { Membership } from "src/app/shared/models/membership.model";
import { Member } from "src/app/shared/models/member.model";
import { MembersService } from "src/app/shared/services/members/members.service";
import { MembershipsService } from "src/app/shared/services/memberships/memberships.service";
import { AppConfirmService } from "src/app/shared/services/app-confirm/app-confirm.service";
import { AppLoaderService } from "src/app/shared/services/app-loader/app-loader.service";
import { ProfileMembershipRenewComponent } from "./profile-membership-renew/profile-membership-renew.component";
import { ProfileMembershipCancelComponent } from "./profile-membership-cancel/profile-membership-cancel.component";

@Component({
  selector: "app-profile-membership",
  templateUrl: "./profile-membership.component.html",
  styleUrls: ["./profile-membership.component.scss"],
  animations: [cplAnimations],
})
export class ProfileMembershipComponent implements OnInit {
  membership: Membership;
  member: Member;
  checked = false;
  toggleOn = this.checked;
  disabled = true;
  color = "red";
  memberReady = false;

  constructor(
    private memberService: MembersService,
    private membershipsService: MembershipsService,
    private dialog: MatDialog,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getData().subscribe((res) => {
      console.log(res);
      this.member = res[0];
      this.membership = res[1];
      console.log(this.membership);
      this.memberReady = true;
    });
  }

  // Get data about members plan and display it
  // memberid -> member -> member.membership 

  private getData(): Observable<any> {
    const member = this.memberService.findMember({
      _id: window.localStorage.getItem("memberId"),
    });
    const membership = this.memberService.getMembersMembership(
      window.localStorage.getItem("memberId")
    );
    return forkJoin([member, membership]);
  }

  public toggleChange(e: MatSlideToggleChange): void {
    console.log(this.checked, this.toggleOn);
    if (this.checked && this.toggleOn) {
      this.confirmService
        .confirm({ message: `Turn automatic renewal off?` })
        .subscribe((res) => {
          console.log(res);
          if (res) {
            this.loader.open();
            this.checked = false;
            this.toggleOn = false;
            this.changeDetectorRef.detectChanges();
            this.loader.close();
            this.snack.open("Automatic renewal turned off!", "OK", {
              duration: 4000,
            });
          } else {
            this.checked = true;
          }
        });
    } else if (!this.checked && !this.toggleOn) {
      this.confirmService
        .confirm({ message: `Turn automatic renewal on?` })
        .subscribe((res) => {
          console.log(res);
          if (res) {
            this.loader.open();
            this.checked = true;
            this.toggleOn = true;
            this.changeDetectorRef.detectChanges();
            this.loader.close();
            this.snack.open("Automatic renewal turned on!", "OK", {
              duration: 4000,
            });
          } else {
            this.checked = false;
          }
        });
    }
  }

  public cancelMembership(): void {
    this.confirmService
      .confirm({ message: `Are you sure?` })
      .subscribe((res) => {
        console.log(res);
        // Create API for cancelling membership
        this.membershipsService.cancelMembership(this.member._id);
        if (res) {
          this.snack.open("Membership cancelled!", "OK", { duration: 4000 });
        } else {
          this.snack.open("Error!", "OK", { duration: 4000 });
        }
      });
  }

  openRenewPopup(data: any = {}, isNew?) {
    let title = "Renew";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      ProfileMembershipRenewComponent,
      {
        width: "720px",
        disableClose: true,
        data: { title: title, payload: data },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      console.log(res);

      if (!res) {
        // If user press cancel
        return;
      }
      this.loader.open();
      this.memberReady = false;
      setTimeout(() => {
        this.memberReady = true;
        this.snack.open(res, "OK", { duration: 4000 });
        this.loader.close();
      }, 2000);
    });
  }

  openCancelPopup(data: any = {}, isNew?) {
    let title = "Cancel Membership";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      ProfileMembershipCancelComponent,
      {
        width: "720px",
        disableClose: true,
        data: { title: title, payload: data },
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      console.log(res);

      if (!res) {
        // If user press cancel
        return;
      }
      this.loader.open();
      this.memberReady = false;

      setTimeout(() => {
        this.memberReady = true;
        this.snack.open(res, "OK", { duration: 4000 });
        this.loader.close();
      }, 2000);
    });
  }
}
