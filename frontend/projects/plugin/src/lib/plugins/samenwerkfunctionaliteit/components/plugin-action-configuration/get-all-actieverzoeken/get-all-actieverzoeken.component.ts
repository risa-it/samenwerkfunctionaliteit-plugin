import { AsyncPipe, NgIf } from "@angular/common";
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormModule, FormOutput, InputModule } from "@valtimo/components";
import { FunctionConfigurationComponent, FunctionConfigurationData, PluginTranslatePipeModule } from "@valtimo/plugin";
import { BehaviorSubject, combineLatest, Observable, Subscription, take } from "rxjs";
import { AlleActieverzoekenConfig } from "../../../models/actieverzoek-config";

@Component({
  selector: "get-all-actieverzoeken",
  templateUrl: "./get-all-actieverzoeken.component.html",
  imports: [FormModule, InputModule, AsyncPipe, PluginTranslatePipeModule, NgIf],
  standalone: true,
  styleUrl: "./get-all-actieverzoeken.component.scss",
})
export class GetAllActieverzoekenComponent implements FunctionConfigurationComponent, OnInit, OnDestroy {
  @Input() disabled$: Observable<boolean>;
  @Input() pluginId: string;
  @Input() save$: Observable<void>;
  @Input() prefillConfiguration$?: Observable<AlleActieverzoekenConfig>;
  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() configuration: EventEmitter<FunctionConfigurationData> = new EventEmitter<FunctionConfigurationData>();

  private saveSubscription!: Subscription;

  private readonly config$ = new BehaviorSubject<AlleActieverzoekenConfig | null>(null);
  private readonly valid$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.openSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
  }

  formValueChange(formOutput: FormOutput): void {
    this.config$.next(formOutput as AlleActieverzoekenConfig);
    this.handleValid(formOutput as AlleActieverzoekenConfig);
  }

  private handleValid(formOutput: AlleActieverzoekenConfig): void {
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
