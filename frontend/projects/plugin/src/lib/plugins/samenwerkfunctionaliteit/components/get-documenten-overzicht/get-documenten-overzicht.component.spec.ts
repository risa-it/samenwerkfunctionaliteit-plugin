import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PLUGINS_TOKEN } from '@valtimo/plugin';

import { GetDocumentenOverzichtComponent } from './get-documenten-overzicht.component';

describe('GetDocumentenOverzichtComponent', () => {
  let component: GetDocumentenOverzichtComponent;
  let fixture: ComponentFixture<GetDocumentenOverzichtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetDocumentenOverzichtComponent, TranslateModule.forRoot()],
      providers: [{ provide: PLUGINS_TOKEN, useValue: [] }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetDocumentenOverzichtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
