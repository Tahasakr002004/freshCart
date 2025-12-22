import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { CartService } from './cart.service';
import { Cart } from '../models/cart.model';

describe('CartService', () => {
  let service: CartService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CartService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(CartService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should POST addItem and update cart signal when backend returns cart', () => {
    const mockCart: Cart = { items: [], totalAmount: 0, status: 'active' };

    service.addItem('p1', 2).subscribe((res) => {
      expect(res).toEqual(mockCart);
      expect(service.cart()).toEqual(mockCart);
    });

    const req = http.expectOne('/cart/items');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ productId: 'p1', quantity: 2 });
    req.flush(mockCart);
  });

  it('leaves cart signal unchanged when backend returns message string', () => {
    service.cart.set(null);

    service.addItem('p1', 1).subscribe((res) => {
      expect(res).toBe('Already in cart');
      expect(service.cart()).toBeNull();
    });

    const req = http.expectOne('/cart/items');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ productId: 'p1', quantity: 1 });
    req.flush('Already in cart');
  });
});
