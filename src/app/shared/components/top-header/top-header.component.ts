import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { MembersService } from '../../services/members/members.service';
import { Member } from '../../models/member.model';
import Auth from '@aws-amplify/auth';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html',
  styleUrls: ['./top-header.component.scss'],
})
export class TopHeaderComponent implements OnInit {
  public member: Member;

  public menuOpen = false;
  public memberReady = false;

  constructor(
    public auth: AuthenticationService,
    private memberService: MembersService,
    private userService: UserService

  ) {
    this.auth.memberChange.subscribe((res) => {
      this.member = res;
    });
  }

  ngOnInit() {
    Auth.currentAuthenticatedUser()
      .then((res) => {
          this.userService
          .findUser({ _id: window.localStorage.getItem('userId') })
          .subscribe((user) => {
            this.memberService.findMember({_id: user.typeId}).subscribe(member => {
              if (member) {
                this.memberReady = true;
                this.member = member;
              }
            });
          });
      })
      .catch((res) => {
        console.log(this.memberReady);
        this.memberReady = false;
      });
  }

  logout() {
    this.memberReady = false;
    this.auth.signOut();
  }

  public openMenu(): void {
    this.menuOpen = true;
  }

  public closeMenu(): void {
    this.menuOpen = false;
  }
}
