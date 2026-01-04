import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { ProductOverview } from './product-overview';

describe('ProductOverview', () => {
  let component: ProductOverview;
  let fixture: ComponentFixture<ProductOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductOverview],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({})) },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
