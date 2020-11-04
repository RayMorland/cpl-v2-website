import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorsAboutComponent } from './coordinators-about.component';

describe('CoordinatorsAboutComponent', () => {
  let component: CoordinatorsAboutComponent;
  let fixture: ComponentFixture<CoordinatorsAboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoordinatorsAboutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoordinatorsAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
