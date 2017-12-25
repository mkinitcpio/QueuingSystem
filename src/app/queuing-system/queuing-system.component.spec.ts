import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueuingSystemComponent } from './queuing-system.component';

describe('QueuingSystemComponent', () => {
  let component: QueuingSystemComponent;
  let fixture: ComponentFixture<QueuingSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueuingSystemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueuingSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
