import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorizacionesMesComponent } from './autorizaciones-mes.component';

describe('AutorizacionesMesComponent', () => {
  let component: AutorizacionesMesComponent;
  let fixture: ComponentFixture<AutorizacionesMesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutorizacionesMesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutorizacionesMesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
