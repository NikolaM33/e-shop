import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRentComponent } from './product-rent.component';

describe('ProductRentComponent', () => {
  let component: ProductRentComponent;
  let fixture: ComponentFixture<ProductRentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductRentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductRentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
