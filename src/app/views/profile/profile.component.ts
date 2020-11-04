import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  private routerSub: Subscription;
  
  constructor(
    private router: Router
  ) {
    this.routerSub = this.router.events.subscribe(res => {
      if (res instanceof NavigationEnd) {
        if (res.url.includes('profile')) {
          window.scrollTo({top: 0, left: 0, behavior: "smooth" });
        }
      }
    });
  }

  ngOnInit() {

  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }

}
