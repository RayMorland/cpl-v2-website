import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileMembershipRenewComponent } from './profile-membership-renew.component';

describe('ProfileMembershipRenewComponent', () => {
  let component: ProfileMembershipRenewComponent;
  let fixture: ComponentFixture<ProfileMembershipRenewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileMembershipRenewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileMembershipRenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
