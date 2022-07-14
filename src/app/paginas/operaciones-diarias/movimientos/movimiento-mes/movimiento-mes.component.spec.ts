import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientoMesComponent } from './movimiento-mes.component';

describe('MovimientoMesComponent', () => {
  let component: MovimientoMesComponent;
  let fixture: ComponentFixture<MovimientoMesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovimientoMesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovimientoMesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
