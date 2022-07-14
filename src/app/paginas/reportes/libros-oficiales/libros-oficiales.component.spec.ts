import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrosOficialesComponent } from './libros-oficiales.component';

describe('LibrosOficialesComponent', () => {
  let component: LibrosOficialesComponent;
  let fixture: ComponentFixture<LibrosOficialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibrosOficialesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibrosOficialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
