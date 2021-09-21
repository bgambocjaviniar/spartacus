import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ImportConfig,
  ImportCsvService,
  FilesFormValidators,
  ProductsData,
  ImportExportConfig,
} from '@spartacus/cart/import-export/core';
import { CxDatePipe } from '@spartacus/core';
import { LaunchDialogService, FormUtils } from '@spartacus/storefront';
import { Subject } from 'rxjs';
import { filter, startWith, switchMap, take, tap } from 'rxjs/operators';
import { ImportToCartService } from '../../import-to-cart.service';

@Component({
  selector: 'cx-import-entries-form',
  templateUrl: './import-entries-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CxDatePipe],
})
export class ImportEntriesFormComponent implements OnInit {
  form: FormGroup;
  componentData?: ImportConfig;
  loadedFile: string[][] | null;
  formSubmitSubject$ = new Subject();

  @Output()
  submitEvent = new EventEmitter<{
    products: ProductsData;
  }>();

  constructor(
    protected launchDialogService: LaunchDialogService,
    protected importToCartService: ImportToCartService,
    protected importCsvService: ImportCsvService,
    protected filesFormValidators: FilesFormValidators,
    protected importExportConfig: ImportExportConfig
  ) {}

  ngOnInit() {
    this.componentData = this.importExportConfig.cartImportExport?.import;
    this.form = this.buildForm();

    this.formSubmitSubject$
      .pipe(
        tap(() => {
          if (this.form.invalid) {
            this.form.markAllAsTouched();
            FormUtils.deepUpdateValueAndValidity(this.form);
          }
        }),
        switchMap(() =>
          this.form.statusChanges.pipe(
            startWith(this.form.get('file')?.status),
            filter((status) => status !== 'PENDING'),
            take(1)
          )
        ),
        filter((status) => status === 'VALID')
      )
      .subscribe(() => {
        this.save();
      });
  }

  close(reason: string): void {
    this.launchDialogService.closeDialog(reason);
  }

  save() {
    const file: File = this.form.get('file')?.value?.[0];
    this.importCsvService
      .loadCsvData(file)
      .subscribe((loadedFile: string[][]) => {
        this.submitEvent.emit({
          products: this.importToCartService.csvDataToProduct(loadedFile),
        });
      });
  }

  protected buildForm(): FormGroup {
    const form = new FormGroup({});
    form.setControl(
      'file',
      new FormControl(
        '',
        [
          Validators.required,
          this.filesFormValidators.maxSize(
            this.componentData?.fileValidity?.maxSize
          ),
        ],
        [
          this.importCsvService
            .isReadableFile(this.importToCartService.isDataParsableToProducts)
            .bind(this.importCsvService),
        ]
      )
    );
    return form;
  }
}
