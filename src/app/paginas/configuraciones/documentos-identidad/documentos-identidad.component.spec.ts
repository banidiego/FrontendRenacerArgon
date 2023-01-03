import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosIdentidadComponent } from './documentos-identidad.component';

describe('DocumentosIdentidadComponent', () => {
  let component: DocumentosIdentidadComponent;
  let fixture: ComponentFixture<DocumentosIdentidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentosIdentidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentosIdentidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
