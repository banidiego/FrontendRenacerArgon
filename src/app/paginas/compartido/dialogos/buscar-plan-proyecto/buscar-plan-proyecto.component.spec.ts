import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarPlanProyectoComponent } from './buscar-plan-proyecto.component';

describe('BuscarPlanProyectoComponent', () => {
  let component: BuscarPlanProyectoComponent;
  let fixture: ComponentFixture<BuscarPlanProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarPlanProyectoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarPlanProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
