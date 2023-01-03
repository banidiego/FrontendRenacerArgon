import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaSistemaComponent } from './lista-sistema.component';

describe('ListaSistemaComponent', () => {
  let component: ListaSistemaComponent;
  let fixture: ComponentFixture<ListaSistemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaSistemaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaSistemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
