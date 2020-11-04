import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { MatStepper } from '@angular/material';
import { Member } from 'src/app/shared/models/member.model';
import { Membership } from 'src/app/shared/models/membership.model';
import { Meet } from 'src/app/shared/models/meet.model';
import { MembersService } from 'src/app/shared/services/members/members.service';
import { PaymentsService } from 'src/app/shared/services/payments/payments.service';
import { MembershipsService } from 'src/app/shared/services/memberships/memberships.service';
import { LeagueService } from 'src/app/shared/services/league/league.service';
import { MeetsService } from 'src/app/shared/services/meets/meets.service';
import { Plan } from 'src/app/shared/models/plan.model';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { User } from 'src/app/shared/models/user.model';
import { AppLoaderService } from 'src/app/shared/services/app-loader/app-loader.service';
import { stripeTest } from 'src/credentials';

declare var Stripe: any;

@Component({
  selector: 'app-onboarding-wizard',
  templateUrl: './onboarding-wizard.component.html',
  styleUrls: ['./onboarding-wizard.component.scss'],
})
export class OnboardingWizardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('stepper', { static: false }) private myStepper: MatStepper;
  @ViewChild("cardNumber", { static: false }) cardNumber: ElementRef;
  @ViewChild("cardExpiry", { static: false }) cardExpiry: ElementRef;
  @ViewChild("cardCvc", { static: false }) cardCvc: ElementRef;
  private dataSub: Subscription;
  private memberOnboardingForm: FormGroup;
  private newMember = new Member();
  private user: User;
  private selectedPlan: Plan;
  private selectedMembership: Membership;
  public membershipSelected = false;
  private memberships: Membership[] = [];
  private editMode = false;
  public memberReady = false;
  private card: any;
  private stripe: any;
  // private cardNumber: any;
  private cardNumberElement: any;
  private cardCvcElement: any;
  private cardExpiryElement: any;
  private elementStyles = {
    base: {
      color: "#32325D",
      fontWeight: 500,
      fontFamily: "Source Code Pro, Consolas, Menlo, monospace",
      fontSize: "16px",
      fontSmoothing: "antialiased",

      "::placeholder": {
        color: "#000000",
      },
      ":-webkit-autofill": {
        color: "#000000",
      },
    },
    invalid: {
      color: "#000000",

      "::placeholder": {
        color: "#000000",
      },
    },
  };

  private elementClasses = {
    focus: "focused",
    empty: "empty",
    invalid: "invalid",
  };
  private inputs: any;
  private upcomingMeets: Meet[];
  private paymentComplete = false;

  color = 'primary';
  checked = false;
  disabled = false;

  genders = ['male', 'female'];
  countries = ['Canada'];
  provinces = ['BC'];

  categories = ['Classic Raw', 'Multi-Ply', 'Single-Ply', 'Raw'];
  lifts = ['Full Power', 'Bench Only', 'Deadlift Only'];
  tests = ['Tested', 'Untested'];
  divisions = ['Junior', 'Open', 'Sub-Master', 'Master'];

  meets: [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private memberService: MembersService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private paymentService: PaymentsService,
    private membershipService: MembershipsService,
    private leagueService: LeagueService,
    private meetsService: MeetsService,
    private auth: AuthenticationService,
    private loader: AppLoaderService
  ) {}

  ngOnInit() {
    this.initForm();
    this.dataSub = this.getData().subscribe(
      (res) => {
        console.log(res);
        this.setFormValues(res);
        res[0].map((membership) => {
          this.memberships.push(new Membership(membership));
        });
        this.meets = res[2];
        this.user = new User(res[3]);
        this.editMode = true;
        this.memberReady = true;
        this.changeDetectorRef.detectChanges();
        if (!this.paymentComplete) {
          this.initStripe();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ngAfterViewInit(): void {
    this.inputs = document.querySelectorAll(".cell.example.example2 .input");
    Array.prototype.forEach.call(this.inputs, (input) => {
      input.addEventListener("focus", () => {
        input.classList.add("focused");
      });
      input.addEventListener("blur", () => {
        input.classList.remove("focused");
      });
      input.addEventListener("keyup", () => {
        if (input.value.length === 0) {
          input.classList.add("empty");
        } else {
          input.classList.remove("empty");
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.dataSub.unsubscribe();
  }

  private getData(): Observable<any> {
    const user = this.auth.loggedInUser();
    const memberships = this.membershipService.getMemberships();
    const league = this.leagueService.getLeague();
    const meets = this.meetsService.getMeets();
    return forkJoin([memberships, league, meets, user]);
  }

  // private initStripe() {
  //   // Your Stripe public key
  //   this.stripe = Stripe(stripeTest);

  //   // Create `card` element that will watch for updates
  //   // and display error messages
  //   const elements = this.stripe.elements();
  //   this.card = elements.create('card');
  //   this.card.mount('#card-element');
  //   this.card.addEventListener('change', (event) => {
  //     const displayError = document.getElementById('card-errors');
  //     if (event.error) {
  //       displayError.textContent = event.error.message;
  //     } else {
  //       displayError.textContent = '';
  //     }
  //   });
  // }
  private initStripe(): void {
    // Your Stripe public key
    this.stripe = Stripe(stripeTest);

    // Create `card` element that will watch for updates
    // and display error messages
    const elements = this.stripe.elements();
    this.cardNumberElement = elements.create("cardNumber", {
      style: this.elementStyles,
      classes: this.elementClasses,
    });
    this.cardNumberElement.mount(this.cardNumber.nativeElement);
    this.cardNumberElement.addEventListener("change", (event) => {
      const displayError = document.getElementById("card-number-errors");
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = "";
      }
    });
    this.cardExpiryElement = elements.create("cardExpiry", {
      style: this.elementStyles,
      classes: this.elementClasses,
    });
    this.cardExpiryElement.mount(this.cardExpiry.nativeElement);
    this.cardExpiryElement.addEventListener("change", (event) => {
      const displayError = document.getElementById("card-expiry-errors");
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = "";
      }
    });
    this.cardCvcElement = elements.create("cardCvc", {
      style: this.elementStyles,
      classes: this.elementClasses,
    });
    this.cardCvcElement.mount(this.cardCvc.nativeElement);
    this.cardCvcElement.addEventListener("change", (event) => {
      const displayError = document.getElementById("card-cvc-errors");
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = "";
      }
    });
  }


  private onFormChanges(): void {
    this.memberOnboardingForm.valueChanges.subscribe((val) => {
      console.log(val);
    });
  }

  private setFormValues(member: any): void {}

  private initForm(): void {
    this.memberOnboardingForm = this.fb.group({
      personal: this.fb.group({
        gender: ['', Validators.required],
        dob: [new Date(), Validators.required],
        address: this.fb.group({
          street: ['', Validators.required],
          city: ['', Validators.required],
          province: ['', Validators.required],
          postal: ['', Validators.required],
          country: ['', Validators.required],
        }),
        phone: ['', Validators.required],
      }),
      paymentInfo: this.fb.group({
        billingAddress: this.fb.group({
          street: ['', Validators.required],
          city: ['', Validators.required],
          province: ['', Validators.required],
          postal: ['', Validators.required],
          country: ['', Validators.required],
        }),
      }),
      membershipInfo: this.fb.group({
        membership: [''],
      }),
      planInfo: this.fb.group({
        plan: [''],
      }),
    });

    this.onFormChanges();
  }

  private get genderControl() {
    return this.memberOnboardingForm.get('personal.gender');
  }

  private get dateOfBirthControl() {
    return this.memberOnboardingForm.get('personal.dob');
  }

  private get addressControl() {
    return this.memberOnboardingForm.get('personal.address');
  }

  public billingAddressChange(): void {
    this.checked = !this.checked;
    console.log(this.checked);
    if (this.checked) {
      this.memberOnboardingForm.get('paymentInfo.billingAddress').patchValue({
        street: this.memberOnboardingForm.get('personal.address.street').value,
        city: this.memberOnboardingForm.get('personal.address.city').value,
        province: this.memberOnboardingForm.get('personal.address.province')
          .value,
        postal: this.memberOnboardingForm.get('personal.address.postal').value,
        country: this.memberOnboardingForm.get('personal.address.country')
          .value,
      });
    } else {
      this.memberOnboardingForm.get('paymentInfo.billingAddress').patchValue({
        street: '',
        city: '',
        province: '',
        postal: '',
        country: '',
      });
    }
  }

  public selectMembership(id: string): void {
    this.selectedMembership = this.memberships.find(membership => membership._id === id);
    this.memberOnboardingForm.get('membershipInfo.membership').patchValue(id);
    this.membershipSelected = true;
    this.changeDetectorRef.detectChanges();
    this.goForward();
    console.log(this.selectedMembership);
  }

  public selectPlan(id: string): void {
    this.selectedPlan = this.selectedMembership.plans.find(plan => plan._id === id);
    console.log(this.selectedPlan);
    this.goForward();
  }

  public payForMembership(): void {}

  public submitOnboardingForm(): void {

    this.loader.open();

    this.newMember.userId = this.user._id;
    this.newMember.personal.gender = this.memberOnboardingForm.get(
      'personal.gender'
    ).value;
    this.newMember.personal.dob = this.memberOnboardingForm.get(
      'personal.dob'
    ).value;
    this.newMember.personal.address = this.memberOnboardingForm.get(
      'personal.address'
    ).value;
    this.newMember.personal.phone = this.memberOnboardingForm.get(
      'personal.phone'
    ).value;

    this.newMember.membership.membershipId = this.selectedMembership._id;
    this.newMember.membership.planId = this.selectedPlan._id;

    console.log(this.newMember);

    const paymentInfo = {
      token: '',
      plan: this.selectedPlan.stripeId,
      member: this.newMember,
      billingInfo: this.memberOnboardingForm.get('paymentInfo').value,
    };

    console.log(paymentInfo);

    this.memberService.createMember(this.newMember).subscribe(
      (res) => {
        if (res) {
          console.log(res);
          this.auth.changeMember(res);
          window.localStorage.setItem('memberId', res._id);
          paymentInfo.member = res;
          this.stripe.createToken(this.cardNumberElement).then((result) => {
            if (result.error) {
              console.log('Error creating payment method.');
              const errorElement = document.getElementById('card-errors');
              errorElement.textContent = result.error.message;
            } else {
              // At this point, you should send the token ID
              // to your server so it can attach
              // the payment source to a customer
              console.log('Token acquired!');
              console.log(result.token);
              console.log(result.token.id);
              paymentInfo.token = result.token;
              this.paymentService
                .processMembershipPayment(paymentInfo)
                .subscribe(
                  (res) => {
                    this.loader.close();
                    console.log('Registration Payment Success!', res);
                    // this.router.navigate(['/profile']);
                    this.goForward();
                  },
                  (err) => {
                    this.loader.close();
                    console.log(err);
                  }
                );
            }
          });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  private navigate(url): void {
    this.router.navigate([url]);
  }

  private cancel(): void {
    this.auth.signOut();
  }

  private goBack(): void {
    this.myStepper.previous();
  }

  private goForward(): void {
    this.myStepper.next();
  }
}
