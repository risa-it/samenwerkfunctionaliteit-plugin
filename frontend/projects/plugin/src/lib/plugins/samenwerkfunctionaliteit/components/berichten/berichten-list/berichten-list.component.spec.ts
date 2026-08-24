import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { Message } from '../../../models/bericht.model';
import { BerichtenListComponent } from './berichten-list.component';

const mockBerichten: Message[] = [];
const mockIsLoading: boolean = true;

describe('BerichtenListComponent', () => {
  let component: BerichtenListComponent;
  let fixture: ComponentFixture<BerichtenListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BerichtenListComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(BerichtenListComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('messages', mockBerichten);
    fixture.componentRef.setInput('isLoading', mockIsLoading);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
