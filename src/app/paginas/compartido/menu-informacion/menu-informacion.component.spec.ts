import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuInformacionComponent } from './menu-informacion.component';

describe('MenuInformacionComponent', () => {
  let component: MenuInformacionComponent;
  let fixture: ComponentFixture<MenuInformacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuInformacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuInformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
