import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesRendirComponent } from './solicitudes-rendir.component';

describe('SolicitudesRendirComponent', () => {
  let component: SolicitudesRendirComponent;
  let fixture: ComponentFixture<SolicitudesRendirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudesRendirComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesRendirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
