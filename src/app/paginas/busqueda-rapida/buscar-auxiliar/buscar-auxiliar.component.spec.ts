import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarAuxiliarComponent } from './buscar-auxiliar.component';

describe('BuscarAuxiliarComponent', () => {
  let component: BuscarAuxiliarComponent;
  let fixture: ComponentFixture<BuscarAuxiliarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarAuxiliarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarAuxiliarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
