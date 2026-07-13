import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ActivatedRoute, convertToParamMap } from "@angular/router";
import { VALTIMO_CONFIG } from "@valtimo/shared";

import { NotificatiesCustomTab } from "./notificaties-custom-tab.component";

describe("NotificatiesCustomTabComponent", () => {
  let component: NotificatiesCustomTab;
  let fixture: ComponentFixture<NotificatiesCustomTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificatiesCustomTab],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({}) } },
        },
        {
          provide: VALTIMO_CONFIG,
          useValue: {
            whitelistedDomains: [],
            mockApi: { endpointUri: "" },
            swagger: { endpointUri: "" },
            valtimoApi: { endpointUri: "" },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificatiesCustomTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
