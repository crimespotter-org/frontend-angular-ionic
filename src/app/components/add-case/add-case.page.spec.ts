import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCasePage } from './add-case.page';

describe('AddEventPage', () => {
  let component: AddCasePage;
  let fixture: ComponentFixture<AddCasePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddCasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
