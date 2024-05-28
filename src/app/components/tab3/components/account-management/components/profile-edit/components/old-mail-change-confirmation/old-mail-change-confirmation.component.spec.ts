import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OldMailChangeConfirmationComponent } from './old-mail-change-confirmation.component';

describe('OldMailChangeConfirmationComponent', () => {
  let component: OldMailChangeConfirmationComponent;
  let fixture: ComponentFixture<OldMailChangeConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OldMailChangeConfirmationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OldMailChangeConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
