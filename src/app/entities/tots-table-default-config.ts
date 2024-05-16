import { TotsTableDefaultConfig } from '@tots/table/lib/entities/tots-table-default-config';
import { CustomLoadingComponent } from "../components/custom-loading/custom-loading.component";

export const totsTableDefaultConfig: TotsTableDefaultConfig = {
  messageNotFound: "Mensaje personalizado. No hay elementos",
  loadingComponent: CustomLoadingComponent,
  matColor: "warn",
  upperPaginator: true,
  //lowerPaginator: false,
  upperProgressBar: true,
  //lowerProgressBar: false,
}