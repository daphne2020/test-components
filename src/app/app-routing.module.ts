import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponentComponent } from './pages/form-component/form-component.component';
import { FormSidebarComponent } from './pages/form-sidebar/form-sidebar.component';
import { FormWizardComponent } from '@tots/form-wizard';
import { TableComponent } from './pages/table/table.component';

const routes: Routes = [
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
