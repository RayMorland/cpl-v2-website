import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutPowerliftingComponent } from './about-powerlifting.component';

describe('AboutPowerliftingComponent', () => {
  let component: AboutPowerliftingComponent;
  let fixture: ComponentFixture<AboutPowerliftingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutPowerliftingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutPowerliftingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
