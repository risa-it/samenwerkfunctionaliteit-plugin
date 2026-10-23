import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PLUGINS_TOKEN } from '@valtimo/plugin';
import { GetSamenwerkingNotificatiesComponent } from './get-samenwerking-notificaties.component';

describe('GetSamenwerkingNotificatiesComponent', () => {
  let component: GetSamenwerkingNotificatiesComponent;
  let fixture: ComponentFixture<GetSamenwerkingNotificatiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetSamenwerkingNotificatiesComponent, TranslateModule.forRoot()],
      providers: [{ provide: PLUGINS_TOKEN, useValue: [] }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetSamenwerkingNotificatiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
