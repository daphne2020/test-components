import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { TotsListResponse, TotsQuery } from '@tots/core';
import { TotsTableFullGroupComponent } from '@tots/editable-columns';
import { StringFieldComponent, SubmitButtonFieldComponent, TotsActionForm, TotsFieldForm, TotsFormComponent, TotsFormModalService, TotsModalConfig } from '@tots/form';
import { TotsCheckboxColumn } from '@tots/table';
import { TotsMoreMenuColumn } from '@tots/table';
import { TotsStatusIconColumn } from '@tots/table';
import { TotsStringColumn } from '@tots/table';
import { TotsMoreMenuItem } from '@tots/table';
import { TotsStatusIconColumnOption } from '@tots/table';
import { TotsActionTable, TotsColumn, TotsTableComponent, TotsTableConfig } from '@tots/table';
import { Observable, delay, of, tap, throwError } from 'rxjs';
import { Client } from 'src/app/entities/client.model';
import { ClientsService } from 'src/app/services/client.service';
import { UserService } from 'src/app/services/user.service';
import { NEW, EDIT } from '../../constants/action.constant';

export class Item {
  type: number = 0;
  customer_id: number = 0;
  type_toggle: number = 0;
  datepicker_time: any;
  datepicker_time_end: any;
  extra!: { param_test: string; }
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @ViewChild('tableComp') tableComp!: TotsTableComponent;
  @ViewChild('tableCompGroup') tableCompGroup!: TotsTableFullGroupComponent;
  @ViewChild('form') formComp!: TotsFormComponent;
  protected config = new TotsTableConfig();
  public formGroup = new FormGroup({});
  protected clients$: Observable<TotsListResponse<any>> = new Observable<TotsListResponse<any>>();
  protected clientsList: Array<Client> = [];
  protected query: TotsQuery = new TotsQuery();
  private date = new Date();
  protected item!: Client;
  private _currentDate: string = "";
  private client!: Client;
  protected fields = new Array<TotsFieldForm>();
  protected clientCollection: any = null;

  constructor(
    protected userService: UserService,
    protected modalService: TotsFormModalService,
    protected clientsService: ClientsService
  ) { }

  ngOnInit(): void {
    //*** se cargan los datos de la tabla e inicializan datos
    this.currentDate();
    this.onLoadItem();
    this.fetchData(); 
    this.setConfigurations();
    this.clientsFromApi();
  }

  clientsFromApi() {
    this.clientsService.getJson()
      .subscribe((result: any) => {
        this.clientCollection = result
      });
  }

  fetchData() {
    this.userService.list(this.query)
      .subscribe({
        next: (data) => {
          this.clientsService.setClients(data.data);
          this.clientsList = this.clientsService.getClients();
        },
        error: (e) => {
          //*** manejo de errores con Rxjs
          console.log(e);
          return throwError(() => new Error(`Mensaje de error`));
        }
      });
  }

  onLoadItem() {
    if (this.date) {
      let client: Client = {
        id: 0,
        firstname: '',
        lastname: '',
        email: '',
        photo: '',
        edit_field_name: '',
        edit_field_last: '',
        edit_field_email: '',
        active: "1"
      }
      this.item = client;
    }
  }

  currentDate() {
    //*** se cambia el formato de fecha
    this._currentDate = `${this.date.getFullYear()}-
                 ${('0' + (this.date.getMonth() + 1)).slice(-2)}-
                 ${this.date.getDate()} 
                 ${this.date.getHours()}:
                 ${this.date.getMinutes()}`;
  }

  onOrder(column: TotsColumn) {
    let response = new TotsListResponse();

    if (column.order == 'asc') {
      response.data = this.clientsList.sort((a, b) => (a.firstname > b.firstname) ? 1 : ((b.firstname > a.firstname) ? -1 : 0))
    } else {
      response.data = this.clientsList.sort((a, b) => (a.firstname < b.firstname) ? 1 : ((b.firstname < a.firstname) ? -1 : 0))
    }

    response.total = 50;
    this.config.obs = of(response).pipe(delay(1000));
    this.tableCompGroup?.loadItems();
  }

  onTableAction(action: TotsActionTable) {
    if (action.key == 'click-order') {
      this.onOrder(action.item);
    } else if (action.key == 'select-item') {
      action.item.isSelected = true;
    } else if (action.key == 'unselect-item') {
      action.item.isSelected = false;
    } else if (action.key == "form-change") {
      console.log(action.item.valid);
      console.log(action.item.values);
    } else if (action.key == "delete") {
      this.removeItem(action.item);
    } else if (action.key == "page-change") {
      this.changePage(action.item);
    } else if (action.key == "edit") {
      this.openModal(EDIT, action.item);
    }
  }

  onActionForm(action: TotsActionForm) {
    console.log(action);
  }

  setConfigurations() {
    this.config.id = 'Clients';
    //*** se asignan las columnas a la tabla de clientes
    this.config.columns = [
      new TotsCheckboxColumn("check"),
      new TotsStringColumn("firstname", "firstname", "First Name", true),
      new TotsStringColumn("lastname", "lastname", "Last Name", false),
      new TotsStringColumn("email", "email", "Email", false),
      new TotsStatusIconColumn("active", "active", [
        new TotsStatusIconColumnOption(1, "person", "green"),
        new TotsStatusIconColumnOption(0, "clear", "red"),
      ], "Activo"),
      new TotsMoreMenuColumn("more", [
        new TotsMoreMenuItem("edit", "Editar", "edit", "a_css_class"),
        new TotsMoreMenuItem("delete", "Eliminar", "delete"),
      ])
    ];
    let data = new TotsListResponse();
    data.data = [...this.clientsList];
    data.total = 50;
    this.config.obs = of(data).pipe(delay(2000));
  }

  //*** eliminar Item de la tabla
  removeItem(item: any) {
    this.clientsList = this.clientsList.filter(i => i.id != item.id);
    let data = new TotsListResponse();
    data.data = this.clientsList;
    this.config.obs = of(data);
    this.tableCompGroup?.loadItems();
  }

  private changePage(pageEvent: PageEvent) {
    let data = new TotsListResponse();
    data.data = [...this.clientsList];
    data.total = 50;
    this.config.obs = of(data).pipe(delay(2000));
    this.tableComp.loadItems();
  }

  // guardar cliente en el listado
  private saveField(item: any): void {
    this.client = this.clientsService.newClient(item.firstname, item.lastname, item.email);
    this.clientsService.setClient(this.client);
    this.clientsList = this.clientsService.getClients();
    let data = new TotsListResponse();
    data.data = this.clientsList;
    data.total = 50;
    this.config.obs = of(data).pipe(delay(800));
    this.tableCompGroup?.loadItems();
    console.log("Saved data clients:");
    this.modalService.dialog.closeAll();
  }

  setModalFields() {
    return [
      { key: 'firstname', component: StringFieldComponent, label: 'Nombre', validators: [Validators.required], extra: { caption: 'Ingresar nombre ...' }, errors: [{ name: 'required', message: 'Ingrese valor' }], value: '464654' },
      { key: 'lastname', component: StringFieldComponent, label: 'Apellido', validators: [Validators.required], extra: { caption: 'Ingresar apellido...' }, errors: [{ name: 'required', message: 'Ingrese valor' }] },
      { key: 'email', component: StringFieldComponent, label: 'Email', validators: [Validators.required, Validators.email], extra: { caption: 'Ingresar email...' }, errors: [{ name: 'required', message: 'Ingrese valor' }] },
      { key: 'submit', component: SubmitButtonFieldComponent, label: 'Enviar' }
    ];
  }

  //agregar - editar cliente
  openModal(option: any, item?: any) {
    let config = new TotsModalConfig();
    config.title = (option === 'new') ? 'Nuevo Cliente' : "Editar Campos";
    config.autoSave = true;
    config.item = (option === 'new') ? this.item : this.newItem(item);
    config.fields = this.setModalFields();

    this.modalService.open(config)
      .pipe(tap(action => {
        if (action.key == 'submit') {
          action.modal?.componentInstance.showLoading();
          if (option === NEW) {
            this.saveField(action.item);
            action.item.firstname = '';
            action.item.lastname = '';
            action.item.email = '';
          } else if (option === EDIT) {
            this.editField(action.item, item.id);
          }
        }
      }))
      .pipe(delay(2000))
      .pipe(tap(action => action.modal?.componentInstance.hideLoading()))
      .subscribe(action => {
        console.log(action)
      });
  }

  private newItem(item: any) {
    let newItem: Client = {
      id: item.id,
      firstname: item.firstname,
      lastname: item.lastname,
      email: item.email,
      photo: '',
      edit_field_name: '',
      edit_field_last: '',
      edit_field_email: '',
      active: item.action
    }
    return newItem;
  }

  private editField(item: any, id: any) {
    this.clientsService.updateClient(item);
    this.clientsList = this.clientsService.getClients();
    let data = new TotsListResponse();
    data.data = this.clientsList;
    data.total = 50;
    this.config.obs = of(data).pipe(delay(800));
    this.tableCompGroup?.loadItems();
    console.log("Saved data clients:", data.data);
    this.modalService.dialog.closeAll();
  }

}