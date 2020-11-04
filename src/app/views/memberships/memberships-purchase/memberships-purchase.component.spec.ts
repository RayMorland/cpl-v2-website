import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipsPurchaseComponent } from './memberships-purchase.component';

describe('MembershipsPurchaseComponent', () => {
  let component: MembershipsPurchaseComponent;
  let fixture: ComponentFixture<MembershipsPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembershipsPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipsPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
