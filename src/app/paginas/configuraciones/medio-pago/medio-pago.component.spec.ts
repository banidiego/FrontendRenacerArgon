import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedioPagoComponent } from './medio-pago.component';

describe('MedioPagoComponent', () => {
  let component: MedioPagoComponent;
  let fixture: ComponentFixture<MedioPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedioPagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedioPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
