import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  PluginConfigurationComponent,
  PluginConfigurationData,
  PluginTranslatePipeModule,
} from '@valtimo/plugin';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subscription,
  take,
} from 'rxjs';
import { Config } from '../../models';
import { FormModule, FormOutput, InputModule } from '@valtimo/components';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'samenwerkfunctionaliteit-plugin-configuration',
  imports: [
    FormModule,
    InputModule,
    PluginTranslatePipeModule,
    NgIf,
    AsyncPipe,
  ],
  templateUrl: './samenwerkfunctionaliteit-plugin-configuration.component.html',
})
export class SamenwerkfunctionaliteitPluginConfigurationComponent
  implements PluginConfigurationComponent, OnInit, OnDestroy
{
  @Input() save$: Observable<void>;
  @Input() disabled$: Observable<boolean>;
  @Input() pluginId: string;
  @Input() prefillConfiguration$?: Observable<Config>;

  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() configuration: EventEmitter<PluginConfigurationData> =
    new EventEmitter<PluginConfigurationData>();

  private saveSubscription: Subscription;

  private readonly formValue$ = new BehaviorSubject<Config | null>(null);
  private readonly valid$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.openSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
  }

  formValueChange(formValue: FormOutput): void {
    this.formValue$.next(formValue as Config);

    const valid = !!(
      formValue.samenwerkfunctionaliteitUrl && formValue.certificate
    );

    this.valid$.next(valid);
    this.valid.emit(valid);
  }

  private openSaveSubscription() {
    this.saveSubscription = this.save$?.subscribe(() => {
      combineLatest([this.formValue$, this.valid$])
        .pipe(take(1))
        .subscribe(([formValue, valid]) => {
          if (valid) {
            this.configuration.emit(formValue);
          }
        });
    });
  }
}
