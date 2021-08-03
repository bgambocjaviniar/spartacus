import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { finalize, map, switchMap, take, tap } from 'rxjs/operators';
import { LaunchDialogService } from '@spartacus/storefront';
import {
  InvalidFileInfo,
  ImportService,
  FileValidity,
  ProductsData,
} from '@spartacus/cart/import-export/core';
import { ImportToCartService } from '../../import-to-cart.service';

@Component({
  selector: 'cx-import-entries-form',
  templateUrl: './import-entries-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportEntriesFormComponent implements OnInit {
  form: FormGroup = this.build();
  fileValidity: FileValidity;
  descriptionMaxLength: number = 250;
  nameMaxLength: number = 50;
  loadedFile: string[][] | null;
  fileError: InvalidFileInfo = {};

  @Output()
  submitEvent = new EventEmitter<{
    products: ProductsData;
    name: string;
    description: string;
  }>();

  get descriptionsCharacterLeft(): number {
    return (
      this.descriptionMaxLength -
      (this.form.get('description')?.value?.length || 0)
    );
  }

  constructor(
    protected launchDialogService: LaunchDialogService,
    protected importToCartService: ImportToCartService,
    protected importService: ImportService
  ) {}

  ngOnInit() {
    this.launchDialogService.data$
      .pipe(take(1))
      .subscribe((fileValidity: FileValidity) => {
        this.fileValidity = fileValidity;
      });
  }

  close(reason: string): void {
    this.launchDialogService.closeDialog(reason);
  }

  loadFile(file: File, form: FormGroup) {
    this.fileError = {};
    of(file)
      .pipe(
        tap((fileData: File) => {
          this.validateMaxSize(fileData);
        }),
        switchMap(
          (fileData: File) =>
            <Observable<string>>this.importService.loadFile(fileData)
        ),
        map((result: string) => this.importService.readCsvData(result)),
        tap((data: string[][]) => {
          this.validateEmpty(data);
          this.validateParsable(data);
        }),
        finalize(() => {
          form.get('file')?.updateValueAndValidity();
        })
      )
      .subscribe(
        (data: string[][]) => {
          this.loadedFile = data;
        },
        () => {
          this.loadedFile = null;
        }
      );
  }

  submit() {
    if (this.loadedFile) {
      this.submitEvent.emit({
        products: this.importToCartService.csvDataToProduct(this.loadedFile),
        name: this.form.get('name')?.value,
        description: this.form.get('description')?.value,
      });
    }
  }

  protected build(): FormGroup {
    const form = new FormGroup({});
    form.setControl(
      'file',
      new FormControl('', [Validators.required, () => this.fileError])
    );
    form.setControl(
      'name',
      new FormControl('', [
        Validators.required,
        Validators.maxLength(this.nameMaxLength),
      ])
    );
    form.setControl(
      'description',
      new FormControl('', [Validators.maxLength(this.descriptionMaxLength)])
    );
    return form;
  }

  protected validateMaxSize(file: File) {
    if (
      this.fileValidity?.maxSize &&
      file.size / 1000000 > this.fileValidity?.maxSize
    ) {
      this.fileError.tooLarge = true;
      throw Error();
    }
  }

  protected validateEmpty(data: string[][]) {
    if (data.toString().length === 0) {
      this.fileError.empty = true;
      throw Error();
    }
  }

  protected validateParsable(data: string[][]) {
    if (!this.importToCartService.isDataParsable(data)) {
      this.fileError.notParsable = true;
      throw Error();
    }
  }
}
