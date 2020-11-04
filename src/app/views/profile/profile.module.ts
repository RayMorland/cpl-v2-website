import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProfileComponent } from "./profile.component";
import { RouterModule } from "@angular/router";
import { ProfileRoutes } from "./profile.routing";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ProfileSidebarComponent } from "./profile-sidebar/profile-sidebar.component";
import { ProfileContentComponent } from "./profile-content/profile-content.component";
import { ProfileBillingComponent } from "./profile-content/profile-billing/profile-billing.component";
import { ProfileMembershipComponent } from "./profile-content/profile-membership/profile-membership.component";
import { ProfileSettingsComponent } from "./profile-content/profile-settings/profile-settings.component";
import { ProfileRecordsComponent } from "./profile-content/profile-records/profile-records.component";
import { ProfileMeetsComponent } from "./profile-content/profile-meets/profile-meets.component";
import { ProfileHomeComponent } from "./profile-content/profile-home/profile-home.component";
import { SharedModule } from "src/app/shared/shared.module";
import { CardPopupComponent } from "./profile-content/profile-billing/card-popup/card-popup.component";
import { ProfileMeetsDetailComponent } from "./profile-content/profile-meets/profile-meets-detail/profile-meets-detail.component";
import { ProfileMembershipCancelComponent } from "./profile-content/profile-membership/profile-membership-cancel/profile-membership-cancel.component";
import { ProfileMembershipRenewComponent } from "./profile-content/profile-membership/profile-membership-renew/profile-membership-renew.component";
import { ProfileEditProfilePopupComponent } from './profile-content/profile-settings/profile-edit-profile-popup/profile-edit-profile-popup.component';

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileSidebarComponent,
    ProfileContentComponent,
    ProfileBillingComponent,
    ProfileMembershipComponent,
    ProfileSettingsComponent,
    ProfileRecordsComponent,
    ProfileMeetsComponent,
    ProfileHomeComponent,
    CardPopupComponent,
    ProfileMeetsDetailComponent,
    ProfileMembershipRenewComponent,
    ProfileMembershipCancelComponent,
    ProfileEditProfilePopupComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    RouterModule.forChild(ProfileRoutes),
  ],
  entryComponents: [
    CardPopupComponent,
    ProfileMembershipRenewComponent,
    ProfileMembershipCancelComponent,
    ProfileEditProfilePopupComponent
  ],
})
export class ProfileModule {}
