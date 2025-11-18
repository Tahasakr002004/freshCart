import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOverview } from './product-overview';

describe('ProductOverview', () => {
  let component: ProductOverview;
  let fixture: ComponentFixture<ProductOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductOverview]
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
