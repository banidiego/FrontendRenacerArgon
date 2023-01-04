import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarComprobanteComponent } from './buscar-comprobante.component';

describe('BuscarComprobanteComponent', () => {
  let component: BuscarComprobanteComponent;
  let fixture: ComponentFixture<BuscarComprobanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarComprobanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarComprobanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
