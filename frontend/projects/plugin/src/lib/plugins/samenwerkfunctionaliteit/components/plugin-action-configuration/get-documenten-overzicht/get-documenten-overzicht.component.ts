import { AsyncPipe, NgIf } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormModule, FormOutput, InputModule } from "@valtimo/components";
import {
  FunctionConfigurationComponent,
  FunctionConfigurationData,
  PluginTranslatePipeModule
} from "@valtimo/plugin";
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subscription,
  take,
} from "rxjs";
import { GetDocumentenOverzichtConfig } from "../../../models/GetDocumentenOverzichtConfig";

@Component({
  selector: "get-documentenoverzicht",
  templateUrl: "./get-documenten-overzicht.component.html",
  standalone: true,
  imports: [
    FormModule,
    InputModule,
    PluginTranslatePipeModule,
    NgIf,
    AsyncPipe,
  ],
  styleUrl: "./get-documenten-overzicht.component.scss",
})
export class GetDocumentenOverzichtComponent
  implements FunctionConfigurationComponent {
  @Input() save$!: Observable<void>;
  @Input() disabled$!: Observable<boolean>;
  @Input() pluginId!: string;
  @Input() prefillConfiguration$?: Observable<GetDocumentenOverzichtConfig>;
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() configuration: EventEmitter<FunctionConfigurationData> =
    new EventEmitter<FunctionConfigurationData>();

  private saveSubscription!: Subscription;

  private readonly config$ =
    new BehaviorSubject<GetDocumentenOverzichtConfig | null>(null);
  private readonly valid$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.openSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
  }

  formValueChange(formOutput: FormOutput): void {
    this.config$.next(formOutput as GetDocumentenOverzichtConfig);
    this.handleValid(formOutput as GetDocumentenOverzichtConfig);
  }

  private handleValid(formOutput: GetDocumentenOverzichtConfig): void {
    const valid =
      !!formOutput.resultPvName?.trim() &&
      !!formOutput.samenwerkingId?.trim();

    this.valid$.next(valid);
    this.valid.emit(valid);
  }

  private openSaveSubscription(): void {
    this.saveSubscription = this.save$?.subscribe((save) => {
      combineLatest([this.config$, this.valid$])
        .pipe(take(1))
        .subscribe(([config, valid]) => {
          if (valid && config) {
            this.configuration.emit(config);
          }
        });
    });
  }
}
