import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-profile-membership-renew',
  templateUrl: './profile-membership-renew.component.html',
  styleUrls: ['./profile-membership-renew.component.scss']
})
export class ProfileMembershipRenewComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProfileMembershipRenewComponent>,
  ) { }

  ngOnInit() {
    console.log(this.data);
  }

  public renewMembership(): void {
    this.dialogRef.close("Membership Renewed");
  }

  close() {
    this.dialogRef.close();
  }
}
