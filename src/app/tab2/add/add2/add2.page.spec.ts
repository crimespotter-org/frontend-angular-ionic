import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Add2Page } from './add2.page';

describe('Add2Page', () => {
  let component: Add2Page;
  let fixture: ComponentFixture<Add2Page>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Add2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
