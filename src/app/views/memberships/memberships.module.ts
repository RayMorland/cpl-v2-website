import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipsListComponent } from './memberships-list/memberships-list.component';
import { MembershipsPurchaseComponent } from './memberships-purchase/memberships-purchase.component';

@NgModule({
  declarations: [MembershipsListComponent, MembershipsPurchaseComponent],
  imports: [
    CommonModule
  ]
})
export class MembershipsModule { }
