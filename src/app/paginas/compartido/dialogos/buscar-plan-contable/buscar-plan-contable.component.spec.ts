import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarPlanContableComponent } from './buscar-plan-contable.component';

describe('BuscarPlanContableComponent', () => {
  let component: BuscarPlanContableComponent;
  let fixture: ComponentFixture<BuscarPlanContableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarPlanContableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarPlanContableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
