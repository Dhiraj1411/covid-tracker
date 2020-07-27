import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayInfoComponent } from './today-info.component';

describe('TodayInfoComponent', () => {
  let component: TodayInfoComponent;
  let fixture: ComponentFixture<TodayInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodayInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodayInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
