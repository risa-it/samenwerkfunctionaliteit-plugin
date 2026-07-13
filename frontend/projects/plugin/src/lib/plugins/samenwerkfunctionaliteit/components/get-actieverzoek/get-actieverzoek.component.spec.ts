import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PLUGINS_TOKEN } from '@valtimo/plugin';

import { GetActieverzoekComponent } from './get-actieverzoek.component';

describe('GetActieverzoekComponent', () => {
  let component: GetActieverzoekComponent;
  let fixture: ComponentFixture<GetActieverzoekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetActieverzoekComponent, TranslateModule.forRoot()],
      providers: [{ provide: PLUGINS_TOKEN, useValue: [] }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetActieverzoekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
