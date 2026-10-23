import { AsyncPipe, NgIf } from "@angular/common";
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormModule, FormOutput, InputModule } from "@valtimo/components";
import { FunctionConfigurationComponent, FunctionConfigurationData, PluginTranslatePipeModule } from "@valtimo/plugin";
import { BehaviorSubject, combineLatest, Observable, Subscription, take } from "rxjs";
import { ActieverzoekConfig } from "../../../models/actieverzoek-config";

@Component({
  selector: "get-actieverzoek",
  imports: [FormModule, InputModule, AsyncPipe, PluginTranslatePipeModule, NgIf],
  templateUrl: "./get-actieverzoek.component.html",
  styleUrl: "./get-actieverzoek.component.scss",
})
export class GetActieverzoekComponent implements FunctionConfigurationComponent, OnInit, OnDestroy {
  @Input() disabled$: Observable<boolean>;
  @Input() pluginId: string;
  @Input() save$: Observable<void>;
  @Input() prefillConfiguration$?: Observable<ActieverzoekConfig>;
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() configuration: EventEmitter<FunctionConfigurationData> = new EventEmitter<FunctionConfigurationData>();

  private saveSubscription!: Subscription;

  private readonly config$ = new BehaviorSubject<ActieverzoekConfig | null>(null);
  private readonly valid$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.openSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
  }

  formValueChange(formOutput: FormOutput): void {
    this.config$.next(formOutput as ActieverzoekConfig);
    this.handleValid(formOutput as ActieverzoekConfig);
  }

  private handleValid(formOutput: ActieverzoekConfig): void {
    const resultPvName = formOutput.resultPvName ?? "";
    const actieverzoekId = formOutput.actieverzoekId ?? "";

    const valid = resultPvName.trim().length > 0 && actieverzoekId.trim().length > 0;

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
