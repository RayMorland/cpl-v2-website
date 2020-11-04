import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-profile-membership-cancel',
  templateUrl: './profile-membership-cancel.component.html',
  styleUrls: ['./profile-membership-cancel.component.scss']
})
export class ProfileMembershipCancelComponent implements OnInit {
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProfileMembershipCancelComponent>,
  ) { }

  ngOnInit() {
    console.log(this.data);
  }

  public cancelMembership(): void {
    this.dialogRef.close("Membership cancelled");
  }

  public close(): void {
    this.dialogRef.close();
  }
}
