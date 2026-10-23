import { AsyncPipe, NgIf } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormModule, FormOutput, InputModule } from "@valtimo/components";
import { FunctionConfigurationComponent, FunctionConfigurationData, PluginTranslatePipeModule } from "@valtimo/plugin";
import { BehaviorSubject, combineLatest, Observable, Subscription, take } from "rxjs";
import { SamenwerkingConfig } from "../../../models/plugin-action-config/samenwerking-config";

@Component({
  selector: "get-samenwerking",
  templateUrl: "./get-samenwerking.component.html",
  standalone: true,
  styleUrl: "./get-samenwerking.component.scss",
  imports: [InputModule, FormModule, PluginTranslatePipeModule, AsyncPipe, NgIf],
})
export class GetSamenwerkingComponent implements FunctionConfigurationComponent {
  @Input() disabled$: Observable<boolean>;
  @Input() pluginId: string;
  @Input() save$: Observable<void>;
  @Input() prefillConfiguration$?: Observable<SamenwerkingConfig>;
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() configuration: EventEmitter<FunctionConfigurationData> = new EventEmitter<FunctionConfigurationData>();

  private saveSubscription!: Subscription;

  private readonly config$ = new BehaviorSubject<SamenwerkingConfig | null>(null);
  private readonly valid$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.openSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
  }

  formValueChange(formOutput: FormOutput): void {
    this.config$.next(formOutput as SamenwerkingConfig);
    this.handleValid(formOutput as SamenwerkingConfig);
  }

  private handleValid(formOutput: SamenwerkingConfig): void {
    const resultPvName = formOutput.resultPvName ?? "";
    const samenwerkingId = formOutput.samenwerkingId ?? "";

    const valid = resultPvName.trim().length > 0 && samenwerkingId.trim().length > 0;

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
