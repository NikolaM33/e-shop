import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackBarErrorMessageComponent } from './snack-bar-error-message.component';

describe('SnackBarErrorMessageComponent', () => {
  let component: SnackBarErrorMessageComponent;
  let fixture: ComponentFixture<SnackBarErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnackBarErrorMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnackBarErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
