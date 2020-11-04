import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetInfoComponent } from './meet-info.component';

describe('MeetInfoComponent', () => {
  let component: MeetInfoComponent;
  let fixture: ComponentFixture<MeetInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
