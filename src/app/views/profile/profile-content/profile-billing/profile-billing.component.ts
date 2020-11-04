import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { MatDialog, MatSnackBar, MatDialogRef, MatTableDataSource } from '@angular/material';
import { CardPopupComponent } from './card-popup/card-popup.component';
import { Member } from 'src/app/shared/models/member.model';
import { cplAnimations } from 'src/app/shared/animations/cpl-animations';
import { MembersService } from 'src/app/shared/services/members/members.service';
import { AppConfirmService } from 'src/app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'src/app/shared/services/app-loader/app-loader.service';
import { PaymentsService } from 'src/app/shared/services/payments/payments.service';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-profile-billing',
  templateUrl: './profile-billing.component.html',
  styleUrls: ['./profile-billing.component.scss'],
  animations: [cplAnimations]
})
export class ProfileBillingComponent implements OnInit, OnDestroy {
  dataSubscription: Subscription;
  member: Member;
  billingReady = false;
  
  ColumnMode = ColumnMode;

  memberBilling: any = [];
  billingDisplayedColumns: string[] = ["id", "amount_due", "status", "actions"];
  billingDataSource: any = [];

  paymentMethods: any = [];

  displayedColumns = [
    'cardNumber'
  ];

  constructor(
    private memberService: MembersService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private paymentService: PaymentsService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.memberService.findMember({_id: window.localStorage.getItem('memberId')}).subscribe(res => {
      this.member = res;
      console.log(this.member);
      this.dataSubscription = this.getData().subscribe( res => {
        
        this.paymentMethods = res[0].data;
        this.memberBilling = res[1].data;
        console.log(this.memberBilling);
        this.billingDataSource = new MatTableDataSource<any>(
          this.memberBilling
        );
        console.log(this.paymentMethods);
        this.billingReady = true;
        this.changeDetectorRef.detectChanges();
      }, err => {
        console.log(err);
      });
    });
  }

  ngOnDestroy(): void {
    // this.dataSubscription.unsubscribe();
  }

  private getData(): Observable<any> {
    const invoices = this.paymentService.getMembersInvoices(this.member._id);
    const cards = this.paymentService.getMembersPaymentMethods(this.member.stripeId);
    return forkJoin([cards, invoices]);
  }

  openCardPopup(data: any = {}, isNew?) {
    let title = isNew ? 'Add new card' : 'Update card';
    let dialogRef: MatDialogRef<any> = this.dialog.open(CardPopupComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data, isNew: isNew }
    });
    dialogRef.afterClosed()
      .subscribe(res => {

        console.log(res);

        if(!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        if (isNew) {
            // add card
            this.snack.open('Card Added!', 'OK', { duration: 4000 });
            this.loader.close();
        } else {
            this.snack.open('Card Updated!', 'OK', { duration: 4000 });
            this.loader.close();
        }
      });
  }

  deleteItem(row) {
    this.confirmService.confirm({message: `Delete ${row.cardNumber}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          // delete card
          this.loader.close();
          this.snack.open('Card deleted!', 'OK', { duration: 4000 })
        }
      });
  }

}
