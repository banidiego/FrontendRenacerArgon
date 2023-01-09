import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrMensualesComponent } from './sr-mensuales.component';

describe('SrMensualesComponent', () => {
  let component: SrMensualesComponent;
  let fixture: ComponentFixture<SrMensualesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SrMensualesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SrMensualesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
