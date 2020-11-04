import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedMaterialModule } from 'src/app/shared/shared-material.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { AboutCplComponent } from './about-cpl.component';

describe('AboutCplComponent', () => {
  let component: AboutCplComponent;
  let fixture: ComponentFixture<AboutCplComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedMaterialModule, SharedModule],
      declarations: [ AboutCplComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutCplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
