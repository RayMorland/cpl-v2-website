import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndConditionsPopupComponent } from './terms-and-conditions-popup.component';

describe('TermsAndConditionsPopupComponent', () => {
  let component: TermsAndConditionsPopupComponent;
  let fixture: ComponentFixture<TermsAndConditionsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsAndConditionsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndConditionsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
