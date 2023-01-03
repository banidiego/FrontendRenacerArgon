import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcionesProyectoComponent } from './opciones-proyecto.component';

describe('OpcionesProyectoComponent', () => {
  let component: OpcionesProyectoComponent;
  let fixture: ComponentFixture<OpcionesProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpcionesProyectoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpcionesProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
