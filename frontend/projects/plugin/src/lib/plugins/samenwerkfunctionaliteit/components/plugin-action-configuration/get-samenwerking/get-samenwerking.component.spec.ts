import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PLUGINS_TOKEN } from '@valtimo/plugin';
import { GetSamenwerkingComponent } from './get-samenwerking.component';

describe('GetSamenwerkingComponent', () => {
  let component: GetSamenwerkingComponent;
  let fixture: ComponentFixture<GetSamenwerkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetSamenwerkingComponent, TranslateModule.forRoot()],
      providers: [{ provide: PLUGINS_TOKEN, useValue: [] }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GetSamenwerkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
