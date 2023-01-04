import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarSrComponent } from './buscar-sr.component';

describe('BuscarSrComponent', () => {
  let component: BuscarSrComponent;
  let fixture: ComponentFixture<BuscarSrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarSrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarSrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
