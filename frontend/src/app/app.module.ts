/*
 * Copyright 2026 Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CommonModule } from '@angular/common';
import {
  HttpBackend,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AccessControlManagementModule } from '@valtimo/access-control-management';
import { AccountModule } from '@valtimo/account';
import { AnalyseModule } from '@valtimo/analyse';
import { BootstrapModule } from '@valtimo/bootstrap';
import { BuildingBlockManagementModule } from '@valtimo/building-block-management';
import {
  CASE_TAB_TOKEN,
  CaseDetailTabAuditComponent,
  CaseDetailTabDocumentsComponent,
  CaseDetailTabProgressComponent,
  CaseDetailTabSummaryComponent,
  CaseModule,
  DefaultTabs,
} from '@valtimo/case';
import { CaseManagementModule } from '@valtimo/case-management';
import { CaseMigrationModule } from '@valtimo/case-migration';
import { ChoiceFieldModule } from '@valtimo/choice-field';
import {
  BpmnJsDiagramModule,
  enableCustomFormioComponents,
  MenuModule,
  registerFormioFileSelectorComponent,
  registerFormioUploadComponent,
  registerFormioValueResolverSelectorComponent,
  ValuePathSelectorComponent,
  WidgetModule,
} from '@valtimo/components';
import { DashboardModule } from '@valtimo/dashboard';
import { DashboardManagementModule } from '@valtimo/dashboard-management';
import { DecisionModule } from '@valtimo/decision';
import { DocumentModule } from '@valtimo/document';
import { FormModule } from '@valtimo/form';
import { FormManagementModule } from '@valtimo/form-management';
import { LayoutModule, TranslationManagementModule } from '@valtimo/layout';
import { LoggingModule } from '@valtimo/logging';
import { MigrationModule } from '@valtimo/migration';
import { MilestoneModule } from '@valtimo/milestone';
import { ObjectModule } from '@valtimo/object';
import { ObjectManagementModule } from '@valtimo/object-management';
import {
  BesluitenApiPluginModule,
  besluitenApiPluginSpecification,
  CatalogiApiPluginModule,
  catalogiApiPluginSpecification,
  DocumentenApiPluginModule,
  documentenApiPluginSpecification,
  NotificatiesApiPluginModule,
  notificatiesApiPluginSpecification,
  ObjectenApiPluginModule,
  objectenApiPluginSpecification,
  ObjectTokenAuthenticationPluginModule,
  objectTokenAuthenticationPluginSpecification,
  ObjecttypenApiPluginModule,
  objecttypenApiPluginSpecification,
  OpenNotificatiesPluginModule,
  openNotificatiesPluginSpecification,
  OpenZaakPluginModule,
  openZaakPluginSpecification,
  PLUGINS_TOKEN,
  ZakenApiPluginModule,
  zakenApiPluginSpecification,
} from '@valtimo/plugin';
import { PluginManagementModule } from '@valtimo/plugin-management';
import { ProcessModule } from '@valtimo/process';
import { ProcessLinkModule } from '@valtimo/process-link';
import { ProcessManagementModule } from '@valtimo/process-management';
import { ResourceModule } from '@valtimo/resource';
import { SecurityModule } from '@valtimo/security';
import {
  ConfigModule,
  ConfigService,
  CustomMultiTranslateHttpLoaderFactory,
  LocalizationService,
} from '@valtimo/shared';
import { SseModule } from '@valtimo/sse';
import { SwaggerModule } from '@valtimo/swagger';
import { TaskModule } from '@valtimo/task';
import { TeamsModule } from '@valtimo/teams';
import {
  registerDocumentenApiFormioUploadComponent,
  ZgwModule,
} from '@valtimo/zgw';
import { LoggerModule } from 'ngx-logger';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {
  BerichtenCustomTabComponent,
  DocumentenlijstWidgetTabComponent,
  NotificatiesCustomTabComponent,
  SamenwerkfunctionaliteitPluginModule,
  samenwerkfunctionaliteitPluginSpecification,
  SamenwerkingWidgetTabComponent,
} from '@valtimo-plugins/samenwerkfunctionaliteit-plugin';

export function tabsFactory() {
  return new Map<string, object>([
    [DefaultTabs.summary, CaseDetailTabSummaryComponent],
    [DefaultTabs.progress, CaseDetailTabProgressComponent],
    [DefaultTabs.audit, CaseDetailTabAuditComponent],
    [DefaultTabs.documents, CaseDetailTabDocumentsComponent],
  ]);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    environment.authentication.module,
    AccessControlManagementModule,
    AccountModule,
    AnalyseModule,
    AppRoutingModule,
    BootstrapModule,
    BpmnJsDiagramModule,
    BrowserModule,
    BuildingBlockManagementModule,
    CaseManagementModule,
    CaseMigrationModule,
    CaseModule.forRoot(tabsFactory),
    BesluitenApiPluginModule,
    CatalogiApiPluginModule,
    ChoiceFieldModule,
    CommonModule,
    ConfigModule.forRoot(environment),
    DashboardManagementModule,
    DashboardModule,
    DecisionModule,
    DocumentenApiPluginModule,
    DocumentModule,
    FormManagementModule,
    FormModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    LoggerModule.forRoot(environment.logger),
    LoggingModule,
    MenuModule,
    MigrationModule,
    MilestoneModule,
    NotificatiesApiPluginModule,
    ObjectenApiPluginModule,
    ObjectManagementModule,
    ObjectModule,
    ObjectTokenAuthenticationPluginModule,
    ObjecttypenApiPluginModule,
    OpenNotificatiesPluginModule,
    OpenZaakPluginModule,
    PluginManagementModule,
    ProcessLinkModule,
    ProcessManagementModule,
    ProcessModule,
    ReactiveFormsModule,
    ResourceModule,
    SamenwerkfunctionaliteitPluginModule,
    SecurityModule,
    SseModule,
    SwaggerModule,
    TaskModule,
    TeamsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: CustomMultiTranslateHttpLoaderFactory,
        deps: [HttpBackend, HttpClient, ConfigService, LocalizationService],
      },
    }),
    TranslationManagementModule,
    ValuePathSelectorComponent,
    WidgetModule,
    ZakenApiPluginModule,
    ZgwModule,
  ],
  providers: [
    {
      provide: PLUGINS_TOKEN,
      useValue: [
        besluitenApiPluginSpecification,
        catalogiApiPluginSpecification,
        documentenApiPluginSpecification,
        notificatiesApiPluginSpecification,
        objectTokenAuthenticationPluginSpecification,
        objectenApiPluginSpecification,
        objecttypenApiPluginSpecification,
        openNotificatiesPluginSpecification,
        openZaakPluginSpecification,
        samenwerkfunctionaliteitPluginSpecification,
        zakenApiPluginSpecification,
      ],
    },
    {
      provide: CASE_TAB_TOKEN,
      useValue: {
        'berichten-custom-tab': BerichtenCustomTabComponent,
        'documentenlijst-widget-tab': DocumentenlijstWidgetTabComponent,
        'notificaties-custom-tab': NotificatiesCustomTabComponent,
        'samenwerking-widget-tab': SamenwerkingWidgetTabComponent,
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(injector: Injector) {
    enableCustomFormioComponents(injector);
    registerFormioUploadComponent(injector);
    registerFormioFileSelectorComponent(injector);
    registerDocumentenApiFormioUploadComponent(injector);
    registerFormioValueResolverSelectorComponent(injector);
  }
}
