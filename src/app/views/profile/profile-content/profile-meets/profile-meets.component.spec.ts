import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileMeetsComponent } from './profile-meets.component';

describe('ProfileMeetsComponent', () => {
  let component: ProfileMeetsComponent;
  let fixture: ComponentFixture<ProfileMeetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileMeetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileMeetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
