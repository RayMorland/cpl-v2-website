import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorDetailComponent } from './coordinator-detail.component';

describe('CoordinatorDetailComponent', () => {
  let component: CoordinatorDetailComponent;
  let fixture: ComponentFixture<CoordinatorDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoordinatorDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoordinatorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
