import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubOrigenComponent } from './sub-origen.component';

describe('SubOrigenComponent', () => {
  let component: SubOrigenComponent;
  let fixture: ComponentFixture<SubOrigenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubOrigenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubOrigenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
