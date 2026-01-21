import { NgModule } from '@angular/core';
import { HssQueryBuilderLibComponent } from './hss-query-builder-lib.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { QUERY_BUILDER_COMPONENTS } from './components';

/**
 * @deprecated Use HssQueryBuilderLibComponent as a standalone component instead.
 * 
 * Migration: Import HssQueryBuilderLibComponent directly in your component's
 * imports array instead of importing this module.
 */
@NgModule({
  declarations: [
    HssQueryBuilderLibComponent,
    ...QUERY_BUILDER_COMPONENTS
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    HssQueryBuilderLibComponent,
    ...QUERY_BUILDER_COMPONENTS
  ]
})
export class HssQueryBuilderModule { }
