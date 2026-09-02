import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ModalService } from 'carbon-components-angular';
import { DocumentService } from '../../../service/document.service';
import { SwfDocumentService } from '../../../service/swf-document.service';
import { UploadWorkFlowService } from '../../../service/upload-workflow.service';
import { DocumentTableComponent } from './document-table.component';

describe('DocumentTableComponent', () => {
  let component: DocumentTableComponent;
  let fixture: ComponentFixture<DocumentTableComponent>;

  const swfDocumentService = jasmine.createSpyObj<SwfDocumentService>(
    'SwfDocumentService',
    ['getParam', 'getSamenwerkingProperties'],
  );
  swfDocumentService.getParam.and.returnValue(
    '6bccaaae-0695-4a56-9696-32d12e627f04',
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentTableComponent, TranslateModule.forRoot()],
      providers: [
        { provide: ModalService, useValue: {} },
        { provide: DocumentService, useValue: {} },
        { provide: UploadWorkFlowService, useValue: {} },
        { provide: SwfDocumentService, useValue: swfDocumentService },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
