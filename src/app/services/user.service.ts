import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TotsBaseHttpService, TotsCoreConfig, TotsListResponse, TotsQuery, TOTS_CORE_PROVIDER } from '@tots/core';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService extends TotsBaseHttpService<any> {

  constructor(
    @Inject(TOTS_CORE_PROVIDER) protected override config: TotsCoreConfig,
    protected override http: HttpClient,
  ) {
    super(config, http);
  }

  override list(query: TotsQuery): Observable<TotsListResponse<any>> {
    let response = new TotsListResponse<any>();
    response.data = [
      { id: 1, firstname: 'Axel', lastname: 'Camiletti', email: 'axel@gmail.com', photo: '', edit_field_name: '', edit_field_last: '', edit_field_email: '', active: "1" },
      { id: 2, firstname: 'Matias', lastname: 'Hensi', email: '@gmail.com', photo: '', edit_field_name: '', edit_field_last: '', edit_field_email: '', active: "0" },
      { id: 3, firstname: 'Mayra', lastname: 'Kern', email: 'mayra@gmail.com', photo: '', edit_field_name: '', edit_field_last: '', edit_field_email: '', active: "1" },
      { id: 4, firstname: 'Lau', lastname: 'Thourish', email: 'lau@gmail.com', photo: '', edit_field_name: '', edit_field_last: '', edit_field_email: '', active: "0" },
    ]
    return of(response);
  }

}
