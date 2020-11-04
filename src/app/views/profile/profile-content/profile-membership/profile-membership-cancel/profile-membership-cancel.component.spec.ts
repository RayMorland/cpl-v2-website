import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileMembershipCancelComponent } from './profile-membership-cancel.component';

describe('ProfileMembershipCancelComponent', () => {
  let component: ProfileMembershipCancelComponent;
  let fixture: ComponentFixture<ProfileMembershipCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileMembershipCancelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileMembershipCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
