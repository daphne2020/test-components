import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { DatepickerFieldComponent } from '@tots/date-field-form';
import { TotsActionForm } from '@tots/form';
import { TotsModalConfig } from '@tots/form';
import { SubmitButtonFieldComponent } from '@tots/form';
import { AutocompleteFieldComponent, AutocompleteListFieldComponent, AutocompleteObsFieldComponent, AvatarPhotoFieldComponent, ButtonToggleFieldComponent, FilesListFieldComponent, IntegerFieldComponent, OneFileFieldComponent, PhotosFieldComponent, RadioGroupFieldComponent, RowFieldComponent, SelectFieldComponent, SelectObsFieldComponent, StringFieldComponent, TextareaFieldComponent, TotsFieldForm, TotsFormComponent, TotsFormModalService } from '@tots/form';
import { TotsUsersSelectorMenuConfig } from '@tots/users-selector-menu';
import { delay, map, Observable, of, tap } from 'rxjs';
import { UserService } from '../../services/user.service';
import * as moment from 'moment';
import { DatepickerAndTimeEndFieldComponent, RangeDatepickerFieldComponent } from '@tots/date-field-form';
import { TotsFormApiService, TotsFormModalApiConfig } from '@tots/form-api';
import { HtmlFieldComponent } from '@tots/html-field-form';

/** Mention Style */
import Quill from 'quill';
import { MentionHtmlFieldComponent } from '@tots/quill-mention-field-form';
import { MonacoEditorFieldComponent } from '@tots/monaco-editor-field-form';

const MentionBlot: any = Quill.import("blots/mention");
class StyledMentionBlot extends MentionBlot {
  static render(data: any) {
    const element = document.createElement('span');
    element.innerText = data.value + '}}';
    element.style.color = data.color;
    return element;
  }
}
StyledMentionBlot['blotName'] = "styled-mention";

Quill.register(StyledMentionBlot);
/** End Mention Style */


@Component({
  selector: 'app-form-component',
  templateUrl: './form-component.component.html',
  styleUrls: ['./form-component.component.scss']
})
export class FormComponentComponent implements OnInit {

  fields = new Array<TotsFieldForm>();
  item = { type: 2, customer_id: 3, type_toggle: 2, datepicker_time: '1989-08-25 14:00:00', datepicker_time_end: '1989-08-25 18:00:00', extra: { param_test: '123' } };

  configUserSelector = new TotsUsersSelectorMenuConfig();

  dateNow = moment();

  constructor(
    protected modalService: TotsFormModalService,
    protected userService: UserService,
    protected apiService: TotsFormApiService
  ) { }

  ngOnInit(): void {
    this.configForm2();
    this.loadConfigUserSelector();
  }

  onActionForm(action: TotsActionForm) {
    console.log(action);
  }

  configForm() {
    this.fields = [
      // Campo string
      { key: 'title', component: StringFieldComponent, label: 'Titulo', validators: [Validators.required], extra: { caption: 'Este se mostrara publicamente...', icon: 'home' }, errors: [{ name: 'required', message: 'You must enter a value' }] },
      // Campo Row
      /*{ key: '', component: RowFieldComponent, extra: { fields: [
        { key: 'title', component: StringFieldComponent, label: 'Titulo', validators: [Validators.required], extra: { caption: 'Este se mostrara publicamente...', icon: 'home' } },
        { key: 'title', component: StringFieldComponent, label: 'Titulo', validators: [Validators.required], extra: { caption: 'Este se mostrara publicamente...', icon: 'home' } },
      ] } },*/
      // Campo de selector normal
      { key: 'type', component: SelectFieldComponent, label: 'Tipo', validators: [Validators.required], extra: { options: [
        { id: 1, title: 'Tipo 1'},
        { id: 2, title: 'Tipo 2'},
        { id: 3, title: 'Tipo 3'},
      ] } },
      // Campo Avatar
      { key: 'avatar', component: AvatarPhotoFieldComponent, label: 'Avatar', extra: { button_text: 'Subir imagen', remove_text: 'Eliminar imagen', service: { upload: () => { return of({ url: 'https://storage.googleapis.com/tots-send-public/Frame%2028.png' }) } } } },
      // Campo Date
      { key: 'start_date', component: DatepickerFieldComponent, label: 'Start date', extra: { /*minDate: new Date(),*/ format_output: 'YYYY-MM-DDTHH:mm:ss' } },
      // Campo Files List
      { key: 'attachments', component: FilesListFieldComponent, label: 'Attachments', extra: { textAddButton: '+ Add new file', display_key: 'filename', service: { upload: () => { return of({ filename: 'test_file.png', url: 'https://storage.googleapis.com/tots-send-public/Frame%2028.png' }) } } } },
      // Campo Button Toggle
      { key: 'type_toggle', component: ButtonToggleFieldComponent, label: 'Tipo', validators: [Validators.required], extra: { options: [
        { id: 1, title: 'Tipo 1'},
        { id: 2, title: 'Tipo 2'},
        { id: 3, title: 'Tipo 3'},
      ] } },
      // Campo One File
      { key: 'file_one', component: OneFileFieldComponent, label: 'Upload SIF File', extra: { display_key: 'filename', service: { upload: () => { return of({ filename: 'test_file.png', url: 'https://storage.googleapis.com/tots-send-public/Frame%2028.png' }) } } } },
      // Campo textarea
      { key: 'caption', component: TextareaFieldComponent, label: 'Caption' },
      // Campo Integer
      { key: 'integer', component: IntegerFieldComponent, label: 'Integer Number', validators: [Validators.min(1), Validators.max(5)] },
      // campo Autocomplete OBS
      { key: 'customer_id', component: AutocompleteObsFieldComponent, label: 'Customer', extra: {
        selected_key: 'id',
        filter_key: 'title',
        display_key: 'title',
        display_photo: 'photo',
        first_query: { id: 4, title: 'Customer 4' },
        obs: this.customerAutocompleteObsProcessed.bind(this)
      } },
      // Campo Autocompleete List
      { key: 'customers', component: AutocompleteListFieldComponent, label: 'Select Customer', extra: {
          selected_key: 'id',
          filter_key: 'title',
          display_key: 'title',
          is_show_photo: false,
          placeholder_photo: 'https://storage.googleapis.com/tots-send-public/Frame%2028.png',
          obs: this.customerAutocompleteObsProcessed.bind(this)
      } },
      // Campo Files List
      { key: 'photos', component: PhotosFieldComponent, label: 'Upload photo', extra: { display_key: 'url', service: { upload: () => { return of({ filename: 'test_file.png', url: 'https://storage.googleapis.com/tots-send-public/Frame%2028.png' }) } } } },
      //{ key: 'datepicker_time', component: DatepickerAndTimeEndFieldComponent, label: 'Date picker and time', extra: { field_key_end: 'datepicker_time_end', label_start: 'Start time', label_end: 'End time', format_output: 'YYYY-MM-DDTHH:mm:ss' } },
      { key: 'datepicker_time', component: DatepickerAndTimeEndFieldComponent, label: 'Date picker and time', extra: { field_key_end: 'datepicker_time_end', label_start: 'Start time', label_end: 'End time' } },
      // HTMl Editor
      { key: 'html_editor', component: HtmlFieldComponent, label: 'HTML Editor', extra: { fileService: { upload: () => { return of({ filename: 'test_file.png', url: 'https://storage.googleapis.com/tots-send-public/Frame%2028.png' }).pipe(map(res => res.url)) } } } },
      // HTMl Editor with mention
      {
        key: 'html_editor_mention',
        component: MentionHtmlFieldComponent,
        label: 'HTML Editor with Mention',
        extra: {
          denotationChars: ['@', '{{'],
          blotName: 'styled-mention',
          onSelect: this.mentionOnSelect.bind(this),
          source: this.mentionSource.bind(this),

          fileService: {
            upload: () => {
              return of({ filename: 'test_file.png', url: 'https://storage.googleapis.com/tots-send-public/Frame%2028.png' }).pipe(map(res => res.url))
            }
          }
        }
      },
      {
        key: 'monaco_editor',
        component: MonacoEditorFieldComponent,
        label: 'Editor monaco',
        extra: {
          language: 'mysql',
          // Kinds: https://microsoft.github.io/monaco-editor/typedoc/enums/languages.CompletionItemKind.html
          suggestions: () => {
            return [
              {
                label: 'Ejemplo1',
                kind: (<any>window).monaco.languages.CompletionItemKind.Method,
                insertText: '{{Ejemplo1}}',
                documentation: 'Descripción de Ejemplo1',
              },
              {
                label: 'Test2',
                kind: (<any>window).monaco.languages.CompletionItemKind.Variable,
                insertText: '{{Test2}}',
                preselect: true,
                documentation: 'Descripción de Ejemplo2',
              },
              {
                label: 'Snipper',
                kind: (<any>window).monaco.languages.CompletionItemKind.Snippet,
                insertText: '${sinpper}',
                //command: { id: 'editor.action.insertLineAfter' }
              }
            ];
          }
        }
      },

      { key: ['extra', 'param_test'], component: StringFieldComponent, label: 'Extra Param' },
      // campo Slect OBS
      { key: 'select_obs', component: SelectObsFieldComponent, label: 'Select Customers', extra: {
        selected_key: 'id',
        display_key: 'title',
        obs: this.customerForSelectObs.bind(this)
      } },

      { key: 'submit', component: SubmitButtonFieldComponent, label: 'Enviar' }
    ];
  }

  configForm2() {
    this.fields = [
      {
        key: "start_date",
        component: RangeDatepickerFieldComponent,
        label: "Rango de fechas",
        extra: {
          minDate: moment(),
          maxDays: 7,
          end_date_field_key: "end_date"
        }
      },
      { key: 'submit', component: SubmitButtonFieldComponent, label: 'Enviar' }
    ];
  }

  onClickOpenModal() {
    let config = new TotsModalConfig();
    config.title = 'Modal de ejemplo';
    config.autoSave = true;
    config.item = this.item;
    config.fields = [
      // Campo string
      { key: 'title', component: StringFieldComponent, label: 'Titulo', validators: [Validators.required], extra: { caption: 'Este se mostrara publicamente...' } },
      // Campo de selector normal
      { key: 'type', component: SelectFieldComponent, label: 'Tipo', validators: [Validators.required], extra: { multiple: true, options: [
        { id: 1, title: 'Tipo 1'},
        { id: 2, title: 'Tipo 2'},
        { id: 3, title: 'Tipo 3'},
      ] } },

      { key: 'customer_id', component: AutocompleteFieldComponent, label: 'Customer', extra: {
        selected_key: 'id',
        filter_key: 'title',
        display_key: 'title',
        display_photo: 'photo',
        //first_query: { id: 4, title: 'Customer 4' },
        options: [
          { id: 1, title: 'Customer 1' },
          { id: 2, title: 'Customer 2' },
          { id: 3, title: 'Customer 3' },
          { id: 4, title: 'Customer 4' },
        ]
      } },

      { key: 'submit', component: SubmitButtonFieldComponent, label: 'Enviar' }
    ];
    this.modalService.open(config)
    .pipe(tap(action => {
      if(action.key == 'submit'){
        action.modal?.componentInstance.showLoading();
      }
    }))
    .pipe(delay(2000))
    .pipe(tap(action => action.modal?.componentInstance.hideLoading()))
    .subscribe(action => {
      console.log(action)
    });
  }

  onClickOpenModalApi() {
    let config = new TotsFormModalApiConfig();
    config.title = 'General Event';
    config.autoSave = false;
    config.service = this.userService;
    config.item = {};
    config.fields = [
        { key: 'title', component: StringFieldComponent, label: 'Title', validators: [Validators.required] },
        { key: 'submit', component: SubmitButtonFieldComponent, label: 'CREATE' }
    ];

    this.apiService.open(config)
    .pipe(tap(action => {
      console.log(action);
    }))
    .subscribe(res => console.log('Res'));
  }

  loadConfigUserSelector() {
    this.configUserSelector.service = this.userService;
    this.configUserSelector.searchFields = ['firstname', 'lastname'];
    this.configUserSelector.identifierField = 'id';
    this.configUserSelector.firstnameField = 'firstname';
    this.configUserSelector.lastnameField = 'lastname';
    this.configUserSelector.photoField = 'photo';

    this.configUserSelector.textButton = 'Select user';
    this.configUserSelector.prependIcon = 'person';
  }

  mentionOnSelect(editor: any, item: any, insertItem: any) {
    insertItem(item)
    // necessary because quill-mention triggers changes as 'api' instead of 'user'
    editor.quillEditor.insertText(editor.quillEditor.getLength() - 1, '', 'user');
  }

  mentionSource(editor: any, searchTerm: any, renderList: any, mentionChar: any) {
    let values = [
      { id: 1, value: "Fredrik Sundqvist" },
      { id: 2, value: "Patrik Sjölin" }
    ];

    if (searchTerm.length === 0) {
      renderList(values, searchTerm);
    } else {
      const matches = [];
      for (let i = 0; i < values.length; i++)
        if (
          ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
        )
          matches.push(values[i]);
      renderList(matches, searchTerm);
    }
  }

  customerAutocompleteObsProcessed(query?: string): Observable<Array<any>> {
    if(typeof query !== "string"){
      return of();
    }

    let customers = [
      { id: 1, title: 'Customer 1' },
      { id: 2, title: 'Customer 2' },
      { id: 3, title: 'Customer 3' },
      { id: 4, title: 'Customer 4' },
    ];

    if(query == undefined||query == ''){
      return of(customers);
    }

    return of(customers.filter(c => c.title.toLowerCase().includes(query.toLowerCase())));
  }

  customerForSelectObs(): Observable<Array<any>> {
    let customers = [
      { id: 1, title: 'Customer 1' },
      { id: 2, title: 'Customer 2' },
      { id: 3, title: 'Customer 3' },
      { id: 4, title: 'Customer 4' },
    ];

    return of(customers);
  }

  onChangeDate(value: any) {
    console.log(value);
  }
}
