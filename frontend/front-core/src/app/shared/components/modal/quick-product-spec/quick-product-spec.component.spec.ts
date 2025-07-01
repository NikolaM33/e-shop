import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickProductSpecComponent } from './quick-product-spec.component';

describe('QuickProductSpecComponent', () => {
  let component: QuickProductSpecComponent;
  let fixture: ComponentFixture<QuickProductSpecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickProductSpecComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickProductSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
