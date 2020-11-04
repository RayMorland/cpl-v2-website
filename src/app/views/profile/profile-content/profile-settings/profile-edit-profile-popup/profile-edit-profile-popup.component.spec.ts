import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEditProfilePopupComponent } from './profile-edit-profile-popup.component';

describe('ProfileEditProfilePopupComponent', () => {
  let component: ProfileEditProfilePopupComponent;
  let fixture: ComponentFixture<ProfileEditProfilePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileEditProfilePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEditProfilePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
