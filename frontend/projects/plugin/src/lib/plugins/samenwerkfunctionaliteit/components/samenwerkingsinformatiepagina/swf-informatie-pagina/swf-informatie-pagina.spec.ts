import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { SwfInformatiePaginaComponent } from './swf-informatie-pagina.component';
import { SamenwerkingService } from '../../../service/samenwerking.service';
import { SwfDocumentService } from '../../../service/swf-document.service';
import { ActieverzoekService } from '../../../service/actieverzoek.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Samenwerking } from '../../../models/samenwerking.model';
import { Actieverzoek } from '../../../models/actieverzoek.model';
import { SamenwerkingProperties } from '../../../models/samenwerking-properties.model';
import {
  ActieverzoekStatusList,
  ActieverzoekStatusType,
} from '../../../types/actieverzoek-status.type';
import { ListItem } from 'carbon-components-angular';
import { BusinessKey, toBusinessKey } from '../../../types/business-key.type';
import {
  mapActieverzoekStatusToActieverzoekStatusType,
  mapLinkActionToActieverzoekStatus,
} from '../../../dto/actieverzoek.dto';
import { HttpClient } from '@angular/common/http';
import { TranslateService, TranslateStore } from '@ngx-translate/core';

const mockSamenwerking: Samenwerking = {
  _links: undefined,
  aangemaaktDoor: '',
  aangemaaktDoorNaam: '',
  aantalActieverzoeken: 0,
  aantalNotificaties: 0,
  beschrijving: '',
  bronVerzoek: '',
  contactpersoonEmailadres: '',
  contactpersoonNaam: '',
  contactpersoonTelefoonnummer: '',
  creatieDatumTijd: '',
  eindDatumTijd: '',
  globaleLocatie: '',
  kenmerkSysteem: '',
  laatstAangepastDatumTijd: '',
  laatstAangepastDoor: '',
  laatstAangepastDoorNaam: '',
  nummerBinnenSysteem: '',
  oloVerzoeknummer: '',
  samenwerkDoel: '',
  samenwerkVorm: '',
  samenwerkingId: '',
  status: undefined,
  taal: '',
  titel: '',
  typeVerzoek: '',
  verzoeknummer: '',
};
const mockActieverzoek: Actieverzoek = {
  actieverzoekId: '',
  amountOfMessages: 0,
  createdOn: undefined,
  description: '',
  documents: [],
  lastChangedBy: '',
  lastChangedByName: '',
  lastChangedDateTime: '',
  notice: '',
  productId: '',
  receiver: '',
  receiverName: '',
  samenwerkingId: '',
  sender: '',
  senderName: '',
  status: undefined,
  title: '',
  links: {
    self: {
      href: '/self',
      deprecation: '',
      hreflang: '',
      name: '',
      profile: '',
      templated: '',
      title: '',
      type: '',
    },
    berichtVerzenden: {
      href: '/bericht',
      deprecation: '',
      hreflang: '',
      name: '',
      profile: '',
      templated: '',
      title: '',
      type: '',
    },
    approve: {
      href: '/approve',
      deprecation: '',
      hreflang: '',
      name: '',
      profile: '',
      templated: '',
      title: '',
      type: '',
    },
    reject: {
      href: '/reject',
      deprecation: '',
      hreflang: '',
      name: '',
      profile: '',
      templated: '',
      title: '',
      type: '',
    },
  },
};
const mockSamenwerkingProperties: SamenwerkingProperties = {
  samenwerkingId: '1',
  actieverzoekDetails: {
    actieverzoekId: '1',
    deelnemer: '',
    eventDatumTijd: '',
    eventInitiator: '',
  },
};

const createMockRouteWithParams = (params: { [key: string]: string }) => ({
  paramMap: of({ get: (key: string) => params[key] }),
});

describe('SwfInformatiePaginaComponent', () => {
  let component: SwfInformatiePaginaComponent;
  let fixture: ComponentFixture<SwfInformatiePaginaComponent>;
  let samenwerkingService: jasmine.SpyObj<SamenwerkingService>;
  let swfDocumentService: jasmine.SpyObj<SwfDocumentService>;
  let actieverzoekService: jasmine.SpyObj<ActieverzoekService>;
  let route: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    // Create spy objects for services
    const samenwerkingServiceSpy = jasmine.createSpyObj('SamenwerkingService', [
      'getSamenwerking',
    ]);
    const swfDocumentServiceSpy = jasmine.createSpyObj('SwfDocumentService', [
      'getParam',
      'getSamenwerkingProperties',
    ]);
    const actieverzoekServiceSpy = jasmine.createSpyObj('ActieverzoekService', [
      'getActieverzoek',
    ]);
    const routeSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      paramMap: of({
        get: (key: string) =>
          key === 'documentId' ? 'b42c9cee-680f-4e85-9b9d-0ccda5494923' : null,
      }),
    });

    await TestBed.configureTestingModule({
      imports: [SwfInformatiePaginaComponent],
      providers: [
        { provide: SamenwerkingService, useValue: samenwerkingServiceSpy },
        { provide: SwfDocumentService, useValue: swfDocumentServiceSpy },
        { provide: ActieverzoekService, useValue: actieverzoekServiceSpy },
        { provide: ActivatedRoute, useValue: routeSpy },
        { provide: HttpClient, useValue: {} },
        { provide: TranslateStore, useValue: {} },
        { provide: TranslateService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SwfInformatiePaginaComponent);
    component = fixture.componentInstance;

    samenwerkingService = TestBed.inject(
      SamenwerkingService,
    ) as jasmine.SpyObj<SamenwerkingService>;
    swfDocumentService = TestBed.inject(
      SwfDocumentService,
    ) as jasmine.SpyObj<SwfDocumentService>;
    actieverzoekService = TestBed.inject(
      ActieverzoekService,
    ) as jasmine.SpyObj<ActieverzoekService>;
    route = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;

    // Setup default return values
    swfDocumentService.getParam.and.returnValue(
      'b42c9cee-680f-4e85-9b9d-0ccda5494923',
    );
    swfDocumentService.getSamenwerkingProperties.and.returnValue(
      of(mockSamenwerkingProperties),
    );
    samenwerkingService.getSamenwerking.and.returnValue(of(mockSamenwerking));
    actieverzoekService.getActieverzoek.and.returnValue(of(mockActieverzoek));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update actieverzoekStatusTypes based on actieverzoek links', fakeAsync(() => {
    const mockBusinessKey: BusinessKey = toBusinessKey(
      'b42c9cee-680f-4e85-9b9d-0ccda5494923',
    );
    component['fetchAndLoadSamenwerking'](mockBusinessKey);
    tick();

    const expectedStatusTypes: ActieverzoekStatusType[] = [
      mapActieverzoekStatusToActieverzoekStatusType(
        mapLinkActionToActieverzoekStatus('approve'),
      ),
      mapActieverzoekStatusToActieverzoekStatusType(
        mapLinkActionToActieverzoekStatus('reject'),
      ),
    ];

    expect(component.actieverzoekStatusTypes()).toEqual(expectedStatusTypes);
  }));

  it('should map link action to ActieverzoekStatusType in keyToActieverzoekStatusType', () => {
    const mockLinkAction = 'weigeren';
    const result = component['keyToActieverzoekStatusType'](mockLinkAction);
    expect(result).toBe(
      mapActieverzoekStatusToActieverzoekStatusType(
        mapLinkActionToActieverzoekStatus(mockLinkAction),
      ),
    );
  });
});
