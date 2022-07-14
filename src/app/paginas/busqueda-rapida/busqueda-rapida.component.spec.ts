import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaRapidaComponent } from './busqueda-rapida.component';

describe('BusquedaRapidaComponent', () => {
  let component: BusquedaRapidaComponent;
  let fixture: ComponentFixture<BusquedaRapidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusquedaRapidaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaRapidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
