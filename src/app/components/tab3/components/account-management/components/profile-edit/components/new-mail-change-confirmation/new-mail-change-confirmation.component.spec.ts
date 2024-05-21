import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewMailChangeConfirmationComponent } from './new-mail-change-confirmation.component';

describe('NewMailChangeConfirmationComponent', () => {
  let component: NewMailChangeConfirmationComponent;
  let fixture: ComponentFixture<NewMailChangeConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMailChangeConfirmationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewMailChangeConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
