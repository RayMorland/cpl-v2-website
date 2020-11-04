import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { Member } from 'src/app/shared/models/member.model';
import { cplAnimations } from 'src/app/shared/animations/cpl-animations';

@Component({
  selector: 'app-profile-sidebar',
  templateUrl: './profile-sidebar.component.html',
  styleUrls: ['./profile-sidebar.component.scss'],
  animations: [cplAnimations]
})
export class ProfileSidebarComponent implements OnInit {

  memberReady = false;
  member: Member;

  constructor(
    private auth: AuthenticationService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // this.auth.loggedInMember()
    // .then((res) => {
    //   console.log(res);
    //     this.member = res;
    //     this.changeDetectorRef.detectChanges();
    // })
    // .catch((res) => {
    //   console.log(this.memberReady);
    //   this.memberReady = false;
    // });
    try {
      this.member = this.auth.member;
    } catch (err) {
      console.log(err);
    }
  }

}
