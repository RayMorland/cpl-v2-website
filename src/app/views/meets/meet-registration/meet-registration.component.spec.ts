import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetRegistrationComponent } from './meet-registration.component';

describe('MeetRegistrationComponent', () => {
  let component: MeetRegistrationComponent;
  let fixture: ComponentFixture<MeetRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
