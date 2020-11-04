import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetResultsComponent } from './meet-results.component';

describe('MeetResultsComponent', () => {
  let component: MeetResultsComponent;
  let fixture: ComponentFixture<MeetResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
