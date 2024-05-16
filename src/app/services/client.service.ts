import { Injectable } from '@angular/core';
import { Client } from '../entities/client.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  readonly url_collection = 'assets/json/test_collection.json';

  private clients!: Client[];
  private client!: Client;

  constructor (private readonly http: HttpClient) {
    this.client = {
      id: 0, firstname: '',
      lastname: '',
      photo: '',
      email: '',
      edit_field_name: '',
      edit_field_last: '',
      edit_field_email: '',
      active: "0"
    }
  }
  getJson() {
    // return this.http.get(`${this.URLUser}`);
    let lista = this.http.get<any>(`${this.url_collection}`);
    return lista;
  }

  getClient() {
    return this.client;
  }

  getClients() {
    return this.clients;
  }

  setClient(client: Client) {
    this.clients.push(client);
  }

  setClients(clients: Client[]) {
    this.clients = clients;
  }

  newClient(firstname: string, lastname: string, email: string): Client {
    return {
      id: this.clients.length + 1,
      firstname: firstname,
      lastname: lastname,
      email: email,
      photo: '',
      edit_field_name: '',
      edit_field_last: '',
      edit_field_email: '',
      active: "1"
    };
  }

  updateClient(client: Client) {
    const lista = this.clients.map(element =>
      element.id === client.id ? client : element
    )
    this.clients = lista;
  }
}