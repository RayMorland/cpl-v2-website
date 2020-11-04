import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileMeetsDetailComponent } from './profile-meets-detail.component';

describe('ProfileMeetsDetailComponent', () => {
  let component: ProfileMeetsDetailComponent;
  let fixture: ComponentFixture<ProfileMeetsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileMeetsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileMeetsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
