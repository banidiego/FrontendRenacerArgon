import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAdministrativoComponent } from './menu-administrativo.component';

describe('MenuAdministrativoComponent', () => {
  let component: MenuAdministrativoComponent;
  let fixture: ComponentFixture<MenuAdministrativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuAdministrativoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuAdministrativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
