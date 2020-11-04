import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { Observable, forkJoin } from "rxjs";
import { ChangeDetectionStrategy } from "@angular/compiler/src/core";
import { MatSnackBar, MatStepper } from "@angular/material";
import { cplAnimations } from "src/app/shared/animations/cpl-animations";
import { MembersService } from "src/app/shared/services/members/members.service";
import { Registration } from "src/app/shared/models/registration.model";
import { Meet } from "src/app/shared/models/meet.model";
import { MeetsService } from "src/app/shared/services/meets/meets.service";
import { RegistrationService } from "src/app/shared/services/registrations/registration.service";
import { AppLoaderService } from "src/app/shared/services/app-loader/app-loader.service";
import { ShopService } from "src/app/shared/services/shop.service";
import { Member } from "src/app/shared/models/member.model";
import { PaymentsService } from "src/app/shared/services/payments/payments.service";
import { LeagueService } from "src/app/shared/services/league/league.service";
import { LayoutService } from "src/app/shared/services/layout.service";
import { PlatformService } from "src/app/shared/services/platform/platform.service";
import { League } from "src/app/shared/models/league.model";
import { atLeastOneSelected } from "src/app/shared/helpers/validators";
import { DatePipe } from "@angular/common";
import { map, startWith } from "rxjs/operators";
import { AuthenticationService } from "src/app/shared/services/auth/authentication.service";
import { UserService } from 'src/app/shared/services/user/user.service';
import { stripeTest } from 'src/credentials';

declare var Stripe: any;

@Component({
  selector: "app-meet-registration",
  templateUrl: "./meet-registration.component.html",
  styleUrls: ["./meet-registration.component.scss"],
  animations: [cplAnimations],
})
export class MeetRegistrationComponent implements OnInit, AfterViewInit {
  @ViewChild("stepper", { static: false }) private myStepper: MatStepper;
  @ViewChild("cardNumber", { static: false }) cardNumber: ElementRef;
  @ViewChild("cardExpiry", { static: false }) cardExpiry: ElementRef;
  @ViewChild("cardCvc", { static: false }) cardCvc: ElementRef;
  @ViewChild("formStepper", { static: false }) formStepper: HTMLElement;

  public registrationForm: FormGroup;
  public registration: Registration;
  public members: Member[] = [];
  public editMode = false;
  public formReady = false;
  private meet: Meet;
  public meetReady = false;
  private league = new League();
  private filteredMembers: Observable<Member[]>;
  private weightClassOptions: Observable<{ name: string; weight: string }>;

  private dp = new DatePipe(navigator.language);
  private p = "yyyy-MM-dd";
  private memberAge: any;
  private today: any;
  private birthDate: any;
  private loaderOpen = false;
  private registrationComplete = false;

  private registrationTotal = 1;
  private submitPressed = false;
  private registrantMovements = [];
  private currentMovements = [];

  // Registration Sub Forms
  private registrationPaymentForm: FormGroup;
  private lifterInformation: FormGroup;
  private competitionInformation: FormGroup;
  private feesInformation: FormGroup;

  // Total payment for registration
  private total: number;

  // Stripe Variables
  private stripe: any;
  // private cardNumber: any;
  private cardNumberElement: any;
  private cardCvcElement: any;
  private cardExpiryElement: any;
  formData = {};
  console = console;
  registrationId: string;
  paymentSuccess = false;

  // Meet Variables
  meetId: string;
  member: Member;

  public quantity = 1;

  paymentForm: any;

  clientSecret: any;

  public paymentAddressSame = false;

  public meetStartDate: any;
  public memberAgeAtMeet: any;

  public benchOnly = false;
  public deadliftOnly = false;
  public fullPower = false;

  public usingDefaultCard = false;

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

  constructor(
    private fb: FormBuilder,
    private meetService: MeetsService,
    private memberService: MembersService,
    private registrationService: RegistrationService,
    private route: ActivatedRoute,
    private router: Router,
    private loader: AppLoaderService,
    private changeDetectorRef: ChangeDetectorRef,
    private shopService: ShopService,
    private snackBar: MatSnackBar,
    private paymentsService: PaymentsService,
    public leagueService: LeagueService,
    public platformService: PlatformService,
    private auth: AuthenticationService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loaderOpen = true;
    console.log(this.member);
    this.route.params.subscribe(
      (params: Params) => {
        if (params.hasOwnProperty("id")) {
          this.meetId = params.id;
          if (params.hasOwnProperty("id2")) {
            this.editMode = true;
            this.registrationId = params.id2;
            this.getData().subscribe(
              (response) => {
                this.meet = response[0][0];
                this.registration = new Registration(response[3]);
                this.initForm();
                this.setFormValues();
                this.meetReady = true;
                this.changeDetectorRef.detectChanges();
                if (!this.paymentSuccess) {
                  this.initStripe();
                }
                this.loaderOpen = false;
              },
              (err) => {
                console.log(err);
              }
            );
          } else {
            this.editMode = false;
            this.userService
            .findUser({ _id: window.localStorage.getItem('userId') })
            .subscribe((user) => {
              this.memberService.findMember({_id: user.typeId}).subscribe(member => {
                this.member = member;
                this.getData().subscribe(
                  (response) => {
                    this.meet = response[0][0];
                    this.registration = new Registration();
                    this.initForm();
                    this.meetReady = true;
                    this.changeDetectorRef.detectChanges();
                    if (!this.paymentSuccess) {
                      this.initStripe();
                    }
                    this.loaderOpen = false;
                  },
                  (err) => {
                    console.log(err);
                  }
                );
              });
            });
          }
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

  // Get data for component
  private getData(): Observable<any> {
    if (this.editMode) {
      const meetInfo = this.meetService.findMeet(this.meetId);
      // !! TO DO: Get current default card so they may use it to pay for registration
      const cards = this.paymentsService.getMembersPaymentMethods(
        this.member.stripeId
      );
      const registration = this.registrationService.findRegistration(
        this.registrationId
      );
      return forkJoin([meetInfo, cards, registration]);
    } else {
      const meetInfo = this.meetService.findMeet(this.meetId);
      // TO DO: Get current default card so they may use it to pay for registration
      const cards = this.paymentsService.getMembersPaymentMethods(
        this.member.stripeId
      );
      return forkJoin([meetInfo, cards]);
    }
  }

  // Initialize meet registration form with logged in members info as well as the options set by the meet
  private initForm(): void {
    const meetEvents = this.meet.eventInfo.events.map(
      (control) => new FormControl(false)
    );
    const meetDivisions = this.league.divisions.map(
      (control) => new FormControl(false)
    );
    const meetMerchandise = this.meet.merchandise.map(
      (control) => new FormControl(false)
    );

    this.lifterInformation = this.fb.group({
      address: this.fb.group({
        street: [
          this.member.personal.address.street || "",
          Validators.required,
        ],
        city: [this.member.personal.address.city || "", Validators.required],
        province: [
          this.member.personal.address.province || "",
          Validators.required,
        ],
        postal: [
          this.member.personal.address.postal || "",
          Validators.required,
        ],
        country: [
          this.member.personal.address.country || "",
          Validators.required,
        ],
      }),
      phone: [
        {
          value: this.member.personal.phone ? this.member.personal.phone : "",
          disabled: true,
        },
        Validators.required,
      ],
      homeGym: [this.member.personal.homeGym || ""],
      coach: [this.member.personal.coach || ""],
      dateOfBirth: [
        { value: this.member.personal.dob || null, disabled: true },
        Validators.required,
      ],
      gender: [
        { value: this.member.personal.gender || "", disabled: true },
        Validators.required,
      ],
      firstName: [
        { value: this.member.personal.firstName || "", disabled: true },
        Validators.required,
      ],
      lastName: [
        { value: this.member.personal.lastName || "", disabled: true },
        Validators.required,
      ],
      email: [
        { value: this.member.email || "", disabled: true },
        Validators.required,
      ],
    });

    this.competitionInformation = this.fb.group({
      weightClass: [null, [Validators.required]],
      divisions: this.fb.array(meetDivisions, atLeastOneSelected),
      category: [null, [Validators.required]],
      test: [null, [Validators.required]],
      events: this.fb.array(meetEvents, atLeastOneSelected),
      lifts: this.fb.array([]),
    });

    this.feesInformation = this.fb.group({
      recordCertificate: [null],
      merchandise: this.fb.array(meetMerchandise),
      feesPaid: [false],
    });

    this.registrationPaymentForm = this.fb.group({
      street: [""],
      city: [""],
      province: [""],
      postal: [""],
      country: [""],
    });

    this.weightClassOptions = this.genderControl.valueChanges.pipe(
      startWith(""),
      map((value) => this.selectWeightClassOptions(value))
    );

    this.eventsControl.valueChanges.subscribe((res) => {
      console.log(this.eventsControl.value);
      this.addLiftControls(res);
    });

    this.onFormChanges();
  }

  private setFormValues() {
    // Personal

    this.dateOfBirthControl.setValue(
      this.dp.transform(this.registration.dateOfBirth, this.p)
    );

    // Competition Info
    this.weightClassControl.setValue(
      this.registration.competitionInfo.weightClass
    );
    this.testControl.setValue(this.registration.competitionInfo.test);
    this.categoryControl.setValue(this.registration.competitionInfo.category);

    this.league.divisions.forEach((division, index) => {
      this.registration.competitionInfo.divisions.forEach((divName, index2) => {
        if (division.name === divName.name) {
          this.divisionsControl.controls[index].setValue(true);
        }
      });
    });

    this.meet.eventInfo.events.forEach((event, index) => {
      this.registration.competitionInfo.events.forEach((eventType, index2) => {
        if (event.type === eventType.type) {
          this.eventsControl.controls[index].setValue(true);
        }
      });
    });

    this.addLiftControls(this.eventsControl.value);
    console.log(this.registration);
    this.registration.competitionInfo.movements.forEach((movement, index) => {
      const control = this.liftsControl.controls.findIndex(
        (controlGroup: FormGroup) => {
          console.log(controlGroup.controls.liftType.value, movement);
          return controlGroup.controls.liftType.value === movement.type;
        }
      );
      this.liftsControl.controls[control].setValue({
        liftType: movement.type,
        openingWeight: movement.openingWeight,
        rackHeight: movement.rackHeight,
        rackPosition: movement.rackPosition,
        safetyHeight: movement.safetyHeight,
      });
    });

    // Fees Info
    this.meet.merchandise.forEach((merch, index) => {
      this.registration.fees.merchandise.forEach((merchItem, index2) => {
        if (merch.item === merchItem.item) {
          this.merchandiseControl.controls[index].setValue(true);
        }
      });
    });
    this.recordCertificateControl.setValue(
      this.registration.fees.recordCertificate.purchased
    );

    this.registrationTotal = this.registration.fees.total;
  }

  get firstNameControl() {
    return this.lifterInformation.get("firstName");
  }
  get lastNameControl() {
    return this.lifterInformation.get("lastName");
  }

  get emailControl() {
    return this.lifterInformation.get("email");
  }

  get genderControl() {
    return this.lifterInformation.get("gender");
  }

  get dateOfBirthControl() {
    return this.lifterInformation.get("dateOfBirth");
  }

  get addressGroup() {
    return this.lifterInformation.get("address");
  }

  get streetControl() {
    return this.lifterInformation.get("address.street");
  }

  get postalControl() {
    return this.lifterInformation.get("address.postal");
  }

  get cityControl() {
    return this.lifterInformation.get("address.city");
  }

  get provinceControl() {
    return this.lifterInformation.get("address.province");
  }

  get countryControl() {
    return this.lifterInformation.get("address.country");
  }

  get weightClassControl() {
    return this.competitionInformation.get("weightClass");
  }

  get categoryControl() {
    return this.competitionInformation.get("category");
  }

  get testControl() {
    return this.competitionInformation.get("test");
  }

  get divisionsControl() {
    return this.competitionInformation.get("divisions") as FormArray;
  }

  get eventsControl() {
    return this.competitionInformation.get("events") as FormArray;
  }

  get liftsControl() {
    return this.competitionInformation.get("lifts") as FormArray;
  }

  get recordCertificateControl() {
    return this.feesInformation.get("recordCertificate");
  }

  get merchandiseControl() {
    return this.feesInformation.get("merchandise") as FormArray;
  }

  private addLiftControls(events) {
    this.registrantMovements = [];

    this.meet.eventInfo.events.forEach((event, index) => {
      console.log(event);
      if (events[index]) {
        this.registrantMovements.push(event.movements);
      }
    });

    let a = [];

    this.registrantMovements.forEach((movement) => {
      a = a.concat(movement.filter((b) => a.indexOf(b) < 0));
    });

    a.forEach((lift) => {
      if (!this.currentMovements.includes(lift)) {
        this.liftsControl.push(
          this.fb.group({
            liftType: [lift, []],
            rackPosition: [null, []],
            rackHeight: [null, []],
            openingWeight: [null, []],
            safetyHeight: [null, []],
          })
        );
      }
    });

    this.currentMovements.forEach((movement) => {
      let i = this.liftsControl.controls.findIndex(
        (liftGroup: FormGroup) => liftGroup.controls.liftType.value === movement
      );
      if (!a.includes(movement)) {
        this.liftsControl.removeAt(i);
      }
    });
    this.currentMovements = a;
  }

  private selectWeightClassOptions(value: string): any {
    let selectedGender = 0;
    this.league.genders.forEach((gender, index) => {
      if (gender.name === value) {
        selectedGender = index;
      }
    });
    return this.league.genders[selectedGender].weightClasses;
  }

  // Get Members current card on file to pay for registration
  private getMembersCard(): void {}

  // Initialize stripe
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

  // Toggle payment address to be same as member address
  public togglePaymentAddress(event): void {
    console.log(event);
    if (event.checked) {
      this.registrationPaymentForm.setValue({
        street: this.lifterInformation.get("address.street").value,
        city: this.lifterInformation.get("address.city").value,
        country: this.lifterInformation.get("address.country").value,
        province: this.lifterInformation.get("address.province").value,
        postal: this.lifterInformation.get("address.postal").value,
      });
    } else {
      this.registrationPaymentForm.setValue({
        street: "",
        city: "",
        country: "",
        province: "",
        postal: "",
      });
    }
  }

  private onFormChanges(): void {
    // this.registrationForm.valueChanges.subscribe(val => {
    //   // console.log(val);
    // });
    this.calculateTotal();
    this.competitionInformation.valueChanges.subscribe((val) => {});
    this.lifterInformation.valueChanges.subscribe((val) => {});
    this.feesInformation.valueChanges.subscribe((val) => {});
  }

  // Submit the registration form. Creates registration form and payment intent.
  private submitRegistrationForm(): void {
    this.loaderOpen = true;

    try {
      // Personal Info
      this.registration.memberId = this.member._id;
      this.registration.meetId = this.meet._id;
      this.registration.name =
        this.firstNameControl.value + this.lastNameControl.value;
      this.registration.email = this.emailControl.value;
      this.registration.address = this.addressGroup.value;
      this.registration.dateOfBirth = this.dateOfBirthControl.value;
      this.registration.gender = this.genderControl.value;

      // Competition Info
      this.registration.competitionInfo.weightClass = this.weightClassControl.value;
      this.registration.competitionInfo.test = this.testControl.value;
      this.registration.competitionInfo.category = this.categoryControl.value;
      this.registration.competitionInfo.divisions = [];
      this.divisionsControl.controls.forEach((control, index) => {
        if (control.value) {
          const division = this.league.divisions[index];
          let selectedAgeClass: { min: any; max: any };
          division.ageClasses.forEach((ages) => {
            if (ages.min <= this.memberAge && this.memberAge <= ages.max) {
              selectedAgeClass = {
                min: ages.min,
                max: ages.max,
              };
            }
          });
          this.registration.competitionInfo.divisions.push({
            name: division.name,
            ageClass: selectedAgeClass,
          });
        }
      });
      this.registration.competitionInfo.events = [];
      this.eventsControl.controls.forEach((control, index) => {
        if (control.value) {
          const event = this.league.events[index];
          this.registration.competitionInfo.events.push({
            type: event.type,
          });
        }
      });
      this.liftsControl.controls.forEach((control, index) => {
        this.registration.competitionInfo.movements.push({
          type: control.value.liftType,
          openingWeight: control.value.openingWeight,
          rackHeight: control.value.rackHeight,
          safetyHeight: control.value.safetyHeight,
          rackPosition: control.value.rackPosition,
        });
      });
      this.registration.fees.merchandise = [];
      this.merchandiseControl.controls.forEach((control, index) => {
        if (control.value) {
          const merchItem = this.meet.merchandise[index];
          this.registration.fees.merchandise.push(merchItem);
        }
      });

      // Fees Info
      // this.registration.fees.total = this.registrationTotal;
      this.registration.fees.total = 10;
      this.registration.fees.recordCertificate.purchased = this.recordCertificateControl.value;
      this.registration.fees.recordCertificate.price = this.league.recordCertificate.price;
    } catch (err) {
      console.log(err);
      this.loaderOpen = false;
    }

    console.log(this.registration);

    if (this.editMode) {
      this.registration._id = this.registrationId;
      this.registrationService
        .updateRegistration(this.registrationId, this.registration)
        .subscribe(
          (res) => {
            this.router.navigate(["/profile/meets/" + this.meetId]);
          },
          (err) => {
            this.loaderOpen = false;
            console.log(err);
          },
          () => {}
        );
    } else {
      // Creates registration and payment intent for stripe
      this.registrationService.createRegistration(this.registration).subscribe(
        (res) => {
          this.clientSecret = res.clientSecret.client_secret;
          // this.snackBar.open("Registration Created", "OK", { duration: 4000 });
          this.myStepper.selectedIndex = 3;
          this.registrationComplete = true;
          this.registrationId = res.registration._id;
          this.loaderOpen = false;
        },
        (err) => {
          this.loaderOpen = false;
          console.log(err);
        }
      );
    }
  }

  // Add selected event types and testing option to meetfee array
  constructMeetFees(): [{ type: string; price: number }] {
    throw new Error("Method not implemented.");
  }

  // Calculate the total for the meet registration
  private calculateTotal(): void {
    let divisionsTotal = 0;
    const numberOfDivisions = this.divisionsControl.controls.filter(
      (control) => control.value
    ).length;
    if (numberOfDivisions > 1) {
      divisionsTotal = 50 * numberOfDivisions;
    }

    let eventsTotal = 0;
    this.eventsControl.controls.forEach((lift, index) => {
      if (lift.value) {
        eventsTotal += this.meet.eventInfo.events[index].price;
      }
    });

    let testTotal = 0;
    this.league.tests.forEach((test) => {
      if (test.type === this.testControl.value) {
        testTotal += test.price;
      }
    });

    let extraFeesTotal = 0;
    if (this.recordCertificateControl.value) {
      extraFeesTotal += 50;
    }

    let merchandiseTotal = 0;
    this.merchandiseControl.controls.forEach((control, index) => {
      if (control.value) {
        merchandiseTotal += this.meet.merchandise[index].price;
      }
    });

    this.registrationTotal =
      divisionsTotal +
      eventsTotal +
      testTotal +
      extraFeesTotal +
      merchandiseTotal;
  }

  //  Pay for and complete a registration for member
  private payForRegistration(): void {
    this.loaderOpen = true;
    this.stripe
      .confirmCardPayment(this.clientSecret, {
        payment_method: {
          card: this.cardNumberElement,
          billing_details: {
            name: "Jenny Rosen",
          },
        },
      })
      .then((result) => {
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          console.log(result.error.message);
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === "succeeded") {
            this.loaderOpen = false;
            this.registrationService.completeRegistration(result, this.registrationId).subscribe(res => {
              console.log(res);
              this.router.navigate(["/profile/meets/" + this.registrationId]);
            }, err => {
              console.log(err);
            });
          }
        }
      });
  }

  // Check if old enough to register
  private minAge(): boolean {
    const now = new Date();
    const dob = new Date(this.member.personal.dob);
    this.memberAge =
      (now.valueOf() - dob.valueOf()) * (1 / (1000 * 60 * 60 * 24 * 365));
    this.meetStartDate = new Date(this.meet.dates[0].start);
    this.memberAgeAtMeet =
      (this.meetStartDate.valueOf() - dob.valueOf()) / 31536000000;
    return this.memberAgeAtMeet >= 18;
  }

  public useDefaultCard(event): void {
    console.log(event);
  }

  // Step backwards in stepper
  goBack(stepper, el) {
    el.scrollIntoView({ behavior: "smooth" });
    this.myStepper.previous();
  }

  //  Go to next step in stepper
  goForward(stepper, el) {
    console.log(el);
    el.scrollIntoView({ behavior: "smooth" });
    this.myStepper.next();
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
}
