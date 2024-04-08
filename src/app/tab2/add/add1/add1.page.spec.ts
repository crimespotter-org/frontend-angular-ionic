import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Add1Page } from './add1.page';

describe('AddPage', () => {
  let component: Add1Page;
  let fixture: ComponentFixture<Add1Page>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Add1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
