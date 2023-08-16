import { NgModule } from '@angular/core';
import { HssQueryBuilderLibComponent } from './hss-query-builder-lib.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QUERY_BUILDER_COMPONENTS } from './components';



@NgModule({
  declarations: [
    HssQueryBuilderLibComponent,
    ...QUERY_BUILDER_COMPONENTS
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    HssQueryBuilderLibComponent,
    ...QUERY_BUILDER_COMPONENTS
  ]
})
export class HssQueryBuilderModule { }
