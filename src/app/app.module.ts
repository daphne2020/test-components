import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TotsDateColumnModule } from '@tots/date-column';
import { TOTS_TABLE_DEFAULT_CONFIG, TotsTableModule } from '@tots/table';
import { TotsEditableColumnsModule } from '@tots/editable-columns';
import { CustomLoadingComponent } from './components/custom-loading/custom-loading.component';
import { TableComponent } from './pages/table/table.component';
import { totsTableDefaultConfig } from './entities/tots-table-default-config';
import { HttpClientModule } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

import { MonacoEditorModule, NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';
import { TotsCoreModule } from '@tots/core';
import { TotsDaySelectorMenuModule } from '@tots/day-selector-menu';
import { TotsRangeDateSelectorMenuModule } from '@tots/range-date-selector-menu';
import { TotsQuillMentionFieldFormModule } from '@tots/quill-mention-field-form';
import { TotsMonacoEditorFieldFormModule } from '@tots/monaco-editor-field-form';
import { FormWizardComponent, TotsFormWizardModule } from '@tots/form-wizard';
import { TotsFormSidebarPageModule } from '@tots/form-sidebar-page';
import { TotsDateFieldFormModule } from '@tots/date-field-form';
import { TotsUsersSelectorMenuModule } from '@tots/users-selector-menu';
import { TotsFormModule } from '@tots/form';
import { FormComponentComponent } from './pages/form-component/form-component.component';
import { FormSidebarComponent } from './pages/form-sidebar/form-sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    CustomLoadingComponent,
    FormComponentComponent,
    FormSidebarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TotsTableModule,
    TotsDateColumnModule,
    TotsEditableColumnsModule,

    HttpClientModule,

    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,

    MonacoEditorModule.forRoot(),

    TotsCoreModule,
    TotsFormModule,
    TotsFormSidebarPageModule,
    TotsDateFieldFormModule,
    TotsUsersSelectorMenuModule,
    TotsDaySelectorMenuModule,
    TotsRangeDateSelectorMenuModule,
    TotsQuillMentionFieldFormModule,
    TotsMonacoEditorFieldFormModule,
    TotsFormWizardModule
  ],
  providers: [
    {
      provide: TOTS_TABLE_DEFAULT_CONFIG,
      useValue: totsTableDefaultConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
