import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoAuxiliarComponent } from './nuevo-auxiliar.component';

describe('NuevoAuxiliarComponent', () => {
  let component: NuevoAuxiliarComponent;
  let fixture: ComponentFixture<NuevoAuxiliarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevoAuxiliarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoAuxiliarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
