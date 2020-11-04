import { Component, OnInit, Inject, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PaymentsService } from 'src/app/shared/services/payments/payments.service';

declare var Stripe: any;

@Component({
  selector: 'app-card-popup',
  templateUrl: './card-popup.component.html',
  styleUrls: ['./card-popup.component.scss']
})
export class CardPopupComponent implements OnInit, AfterViewInit {
  @ViewChild("cardNumber", { static: false }) cardNumber: ElementRef;
  @ViewChild("cardExpiry", { static: false }) cardExpiry: ElementRef;
  @ViewChild("cardCvc", { static: false }) cardCvc: ElementRef;
  public cardForm: FormGroup;

  private card: any;
  private stripe: any;

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CardPopupComponent>,
    private fb: FormBuilder,
    private paymentService: PaymentsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.buildItemForm(this.data.payload);
    console.log(this.data.isNew);
    this.changeDetectorRef.detectChanges();
    if (this.data.isNew) {
      this.initStripe();
    } else {
      this.setCardFormValues();
    }

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

  private onChanges(): void {
    this.cardForm.valueChanges.subscribe(val => {
      console.log(val);
    });
  }

  private setCardFormValues(): void {
    this.cardForm.get('address').patchValue({
      country: this.data.payload.country || '',
      province: this.data.payload.province || '',
      city: this.data.payload.city || '',
      postal: this.data.payload.postal || '',
      street: this.data.payload.street || ''
    });
    this.cardForm.get('name').patchValue({
      first: this.data.payload.name.first || '',
      last: this.data.payload.name.last || '',
    });
  }

  private buildItemForm(item): void {
    this.cardForm = this.fb.group({
      address: this.fb.group({
        country: ['', Validators.required],
        province: ['', Validators.required],
        city: ['', Validators.required],
        postal: ['', Validators.required],
        street: ['', Validators.required]
      }),
      name: this.fb.group({
        first: ['', Validators.required],
        last: ['', Validators.required]
      })
    });

    this.onChanges();
  }

  // Initialize stripe
  private initStripe(): void {
    // Your Stripe public key
    this.stripe = Stripe("pk_test_Xuu3swvutIFVVtiQLCFI53B4");

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

  submit() {
    let token = '';
    const paymentMethod = this.cardForm.value;

    if (this.data.isNew) {
      this.stripe.createToken(this.card).then(result => {
        if (result.error) {
          console.log('Error creating payment method.');
          const errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          console.log('Token acquired!');
          console.log(result.token);
          console.log(result.token.id);
          token = result.token;

          this.paymentService.addPaymentMethod(paymentMethod).subscribe(
            res => {
              console.log('Registration Payment Success!', res);
              this.dialogRef.close(this.cardForm.value);
            },
            err => {
              console.log(err);
            }
          );
        }
      });
    } else if (!this.data.isNew) {
      this.paymentService.updatePaymentMethod(paymentMethod).subscribe(
        res => {
          console.log('Registration Payment Success!', res);
          this.dialogRef.close(this.cardForm.value);
        },
        err => {
          console.log(err);
        }
      );
    }
  }
}
