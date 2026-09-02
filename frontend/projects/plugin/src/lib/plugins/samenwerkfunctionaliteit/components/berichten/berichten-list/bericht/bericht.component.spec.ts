import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateService } from '@ngx-translate/core';
import { IconDescriptor, IconService } from 'carbon-components-angular';
import { Message } from '../../../../models/bericht.model';
import { BerichtComponent } from './bericht.component';

const mockIconDescriptor: IconDescriptor = {
  elem: 'svg',
  attrs: {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 16 16',
    fill: 'currentColor',
    width: '16',
    height: '16',
  },
  content: [],
  name: 'mock-icon',
  size: 16,
  svg: '<svg></svg>',
};

const mockMessage: Message = {
  messageId: '1',
  createdOn: new Date(),
  content: 'content',
  receiver: 'receiver',
  receiverName: 'receiverName',
  samenwerkingId: '12345',
  sender: 'sender',
  senderName: 'senderName',
};

describe('BerichtComponent', () => {
  let component: BerichtComponent;
  let fixture: ComponentFixture<BerichtComponent>;

  beforeEach(async () => {
    const translateService = jasmine.createSpyObj<TranslateService>(
      'TranslateService',
      ['instant'],
    );
    translateService.instant.and.returnValue('');

    const iconService = jasmine.createSpyObj<IconService>('IconService', [
      'get',
    ]);
    iconService.get.and.returnValue(mockIconDescriptor);

    await TestBed.configureTestingModule({
      imports: [BerichtComponent],
      providers: [
        { provide: TranslateService, useValue: translateService },
        { provide: IconService, useValue: iconService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BerichtComponent);

    fixture.componentRef.setInput('message', mockMessage);
    fixture.componentRef.setInput('oinNumber', '1234567890');

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
