import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsientosNoCerradosComponent } from './asientos-no-cerrados.component';

describe('AsientosNoCerradosComponent', () => {
  let component: AsientosNoCerradosComponent;
  let fixture: ComponentFixture<AsientosNoCerradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsientosNoCerradosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsientosNoCerradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
