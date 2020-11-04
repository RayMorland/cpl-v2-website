import { Injectable } from "@angular/core";
import { AuthenticationService } from "./authentication.service";
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
} from "@angular/router";
import { Observable } from "rxjs";
import Auth from "@aws-amplify/auth";
import { MembersService } from "../members/members.service";
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: "root",
})
export class AuthGuard {
  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private membersService: MembersService,
    private usersService: UserService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      Auth.currentAuthenticatedUser()
        .then((user) => {
          if (user != null) {
            this.usersService
              .findUser({ cognitoId: user.username })
              .subscribe((res) => {
                if (res != null) {
                  switch (res.status) {
                    case "onboarding":
                      if (state.url !== "/onboarding") {
                        this.router.navigate(["/onboarding"]);
                        resolve(true);
                      } else {
                        resolve(true);
                      }
                      break;
                    case "active":
                      resolve(true);
                      break;
                    default:
                      this.router.navigate(["/login"]);
                      resolve(false);
                  }
                } else {
                  this.router.navigate(["/login"]);
                  resolve(false);
                }
              });
          } else {
            this.router.navigate(["/login"]);
            resolve(false);
          }
        })
        .catch(() => {
          this.router.navigate(["/login"]);
          resolve(false);
        });
    });
  }
}
