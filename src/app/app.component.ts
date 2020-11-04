import { Component, OnInit, AfterViewInit, Renderer2 } from "@angular/core";
import { Title } from "@angular/platform-browser";
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  ActivatedRouteSnapshot,
} from "@angular/router";

import { RoutePartsService } from "./shared/services/route-parts.service";
import { ThemeService } from "./shared/services/theme.service";

import { filter, switchMap, tap } from "rxjs/operators";
import { LayoutService } from "./shared/services/layout.service";
import { AmplifyService } from "aws-amplify-angular";
import { AuthenticationService } from "./shared/services/auth/authentication.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, AfterViewInit {
  appTitle = "Canadian Powerlifting League";
  pageTitle = "";

  constructor(
    public title: Title,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private routePartsService: RoutePartsService,
    private themeService: ThemeService,
    private layout: LayoutService,
    private renderer: Renderer2,
    private amplifyService: AmplifyService,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.changePageTitle();
  }
  ngAfterViewInit() {
    this.layout.applyMatTheme(this.renderer);
  }
  changePageTitle() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((routeChange: NavigationEnd) => {
        var routeParts = this.routePartsService.generateRouteParts(
          this.activeRoute.snapshot
        );
        if (!routeChange.url.includes('profile')) {
          window.scrollTo({top: 0, left: 0});
        }
        if (!routeParts.length) return this.title.setTitle(this.appTitle);
        // Extract title from parts;
        this.pageTitle = routeParts
          .reverse()
          .map((part) => part.title)
          .reduce((partA, partI) => {
            return `${partA} > ${partI}`;
          });
        this.pageTitle += ` | ${this.appTitle}`;
        this.title.setTitle(this.pageTitle);
      });
  }
}
