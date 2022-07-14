import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroAsientoComponent } from './registro-asiento.component';

describe('RegistroAsientoComponent', () => {
  let component: RegistroAsientoComponent;
  let fixture: ComponentFixture<RegistroAsientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroAsientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroAsientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
