import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutOrganizationComponent } from './about-organization.component';

describe('AboutOrganizationComponent', () => {
  let component: AboutOrganizationComponent;
  let fixture: ComponentFixture<AboutOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutOrganizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
