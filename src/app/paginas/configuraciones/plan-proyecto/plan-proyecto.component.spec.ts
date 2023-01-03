import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanProyectoComponent } from './plan-proyecto.component';

describe('PlanProyectoComponent', () => {
  let component: PlanProyectoComponent;
  let fixture: ComponentFixture<PlanProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanProyectoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
