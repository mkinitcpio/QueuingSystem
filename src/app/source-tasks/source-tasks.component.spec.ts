import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceTasksComponent } from './source-tasks.component';

describe('SourceTasksComponent', () => {
  let component: SourceTasksComponent;
  let fixture: ComponentFixture<SourceTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SourceTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
