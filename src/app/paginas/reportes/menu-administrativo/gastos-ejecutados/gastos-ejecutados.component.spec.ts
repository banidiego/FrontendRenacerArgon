import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosEjecutadosComponent } from './gastos-ejecutados.component';

describe('GastosEjecutadosComponent', () => {
  let component: GastosEjecutadosComponent;
  let fixture: ComponentFixture<GastosEjecutadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GastosEjecutadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GastosEjecutadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
