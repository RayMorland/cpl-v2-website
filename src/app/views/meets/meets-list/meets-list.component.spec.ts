import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetsListComponent } from './meets-list.component';

describe('MeetsListComponent', () => {
  let component: MeetsListComponent;
  let fixture: ComponentFixture<MeetsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
