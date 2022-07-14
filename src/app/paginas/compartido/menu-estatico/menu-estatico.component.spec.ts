import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuEstaticoComponent } from './menu-estatico.component';

describe('MenuEstaticoComponent', () => {
  let component: MenuEstaticoComponent;
  let fixture: ComponentFixture<MenuEstaticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuEstaticoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuEstaticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
