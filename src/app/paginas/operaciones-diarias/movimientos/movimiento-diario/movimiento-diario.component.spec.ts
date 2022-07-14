import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientoDiarioComponent } from './movimiento-diario.component';

describe('MovimientoDiarioComponent', () => {
  let component: MovimientoDiarioComponent;
  let fixture: ComponentFixture<MovimientoDiarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovimientoDiarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovimientoDiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
