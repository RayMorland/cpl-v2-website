import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule, rootRoutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from './shared/shared.module';

import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { LeaderboardComponent } from './views/leaderboard/leaderboard.component';
import { AuthenticationService } from './shared/services/auth/authentication.service';

@NgModule({
  declarations: [
    AppComponent,
    LeaderboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    PerfectScrollbarModule,
    AppRoutingModule,
    AmplifyAngularModule,
    RouterModule.forRoot(rootRoutes, { useHash: false })
  ],
  providers: [AmplifyService, AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
