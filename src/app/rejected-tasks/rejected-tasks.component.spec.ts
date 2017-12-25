import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedTasksComponent } from './rejected-tasks.component';

describe('RejectedTasksComponent', () => {
  let component: RejectedTasksComponent;
  let fixture: ComponentFixture<RejectedTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectedTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
