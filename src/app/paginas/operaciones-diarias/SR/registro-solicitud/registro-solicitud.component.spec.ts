import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroSolicitudComponent } from './registro-solicitud.component';

describe('RegistroSolicitudComponent', () => {
  let component: RegistroSolicitudComponent;
  let fixture: ComponentFixture<RegistroSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroSolicitudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
