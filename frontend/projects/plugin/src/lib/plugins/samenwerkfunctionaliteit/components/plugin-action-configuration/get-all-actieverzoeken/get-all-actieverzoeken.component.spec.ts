import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PLUGINS_TOKEN } from '@valtimo/plugin';
import { GetAllActieverzoekenComponent } from './get-all-actieverzoeken.component';

describe('GetAllActieverzoekenComponent', () => {
  let component: GetAllActieverzoekenComponent;
  let fixture: ComponentFixture<GetAllActieverzoekenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetAllActieverzoekenComponent, TranslateModule.forRoot()],
      providers: [{ provide: PLUGINS_TOKEN, useValue: [] }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetAllActieverzoekenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
