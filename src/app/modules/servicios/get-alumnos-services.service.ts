import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationService } from './core/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'src/app/settings.const';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetAlumnosServicesService {
  
  token = sessionStorage.getItem("token");

  constructor(private https:HttpClient, protected _notificationService: NotificationService,
    private _translate: TranslateService) { }

  getAlumnosAsesorados(data: any){
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.token });
    return this.https
      .post<>(AppSettings.URL_MIDDELWARE + 'verTutorados',data, {headers:headers})
      .pipe(
        catchError((error) => {
          console.log(error);
          return this.handleError(error);
        })
      )
  }


  
  protected handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      this._notificationService.pushError(this._translate.instant('template.notificaciones.error.comunicacion'));
    } else {
      if (error.status === AppSettings.CODE_WRONG_REQUEST) {
        this._notificationService.pushError(this._translate.instant('template.notificaciones.error.solicitudErronea'));
      } else if (error.status === AppSettings.CODE_WITHOUT_AUTHORIZATION) {
        this._notificationService.pushError(this._translate.instant('template.notificaciones.error.solicitudNoAutorizada'));
      } else if (error.status === 403) {
        this._notificationService.pushInfo("Ya cuenta con el rol de Asesor")
      } else {
        this._notificationService.pushError(this._translate.instant('template.notificaciones.error.intentaloMasTarde'));
        this._notificationService.pushMsjResponse(error.error.lstMensajes);
      }
    }

    return throwError('ERROR');
  }
}
