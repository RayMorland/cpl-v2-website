import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutRulesComponent } from './about-rules.component';

describe('AboutRulesComponent', () => {
  let component: AboutRulesComponent;
  let fixture: ComponentFixture<AboutRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
