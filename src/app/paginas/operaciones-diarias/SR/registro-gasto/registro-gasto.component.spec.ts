import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroGastoComponent } from './registro-gasto.component';

describe('RegistroGastoComponent', () => {
  let component: RegistroGastoComponent;
  let fixture: ComponentFixture<RegistroGastoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroGastoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroGastoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
