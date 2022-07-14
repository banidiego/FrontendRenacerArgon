import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesMesComponent } from './solicitudes-mes.component';

describe('SolicitudesMesComponent', () => {
  let component: SolicitudesMesComponent;
  let fixture: ComponentFixture<SolicitudesMesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudesMesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesMesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
