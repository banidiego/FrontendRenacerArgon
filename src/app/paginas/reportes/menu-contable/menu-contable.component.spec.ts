import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuContableComponent } from './menu-contable.component';

describe('MenuContableComponent', () => {
  let component: MenuContableComponent;
  let fixture: ComponentFixture<MenuContableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuContableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuContableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
