import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSignUp } from './admin-sign-up';

describe('AdminSignUp', () => {
  let component: AdminSignUp;
  let fixture: ComponentFixture<AdminSignUp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSignUp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSignUp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
