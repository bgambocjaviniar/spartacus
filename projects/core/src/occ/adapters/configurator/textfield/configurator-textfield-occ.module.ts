import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ConfigModule } from '../../../../config/config.module';
import { ConfiguratorTextfieldAdapter } from '../../../../configurator/textfield/connectors/configurator-textfield.adapter';
import {
  CONFIGURATION_TEXTFIELD_ADD_TO_CART_SERIALIZER,
  CONFIGURATION_TEXTFIELD_NORMALIZER,
} from '../../../../configurator/textfield/connectors/converters';
import { OccConfiguratorTextfieldAddToCartSerializer } from './converters/occ-configurator-textfield-add-to-cart-serializer';
import { OccConfiguratorTextfieldNormalizer } from './converters/occ-configurator-textfield-normalizer';
import { defaultOccConfiguratorTextfieldConfigFactory } from './default-occ-configurator-textfield-config';
import { OccConfiguratorTextfieldAdapter } from './occ-configurator-textfield.adapter';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfigFactory(
      defaultOccConfiguratorTextfieldConfigFactory
    ),
  ],
  providers: [
    {
      provide: ConfiguratorTextfieldAdapter,
      useClass: OccConfiguratorTextfieldAdapter,
    },
    {
      provide: CONFIGURATION_TEXTFIELD_NORMALIZER,
      useExisting: OccConfiguratorTextfieldNormalizer,
      multi: true,
    },
    {
      provide: CONFIGURATION_TEXTFIELD_ADD_TO_CART_SERIALIZER,
      useExisting: OccConfiguratorTextfieldAddToCartSerializer,
      multi: true,
    },
  ],
})
export class ConfiguratorTextfieldOccModule {}
