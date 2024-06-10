import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationService } from './core/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'src/app/settings.const';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  constructor(private https: HttpClient, protected _notificationService: NotificationService,
    private _translate: TranslateService) { }

  postRegistrarHorario(data:any){
    return this.https
    .post(AppSettings.URL_LOCAL_REQUEST+'/horario/registrarHorario',data)
    .pipe(
      catchError((error) => {
        console.log(error);
        return this.handleError(error);
      })
    )
  };

  postObtenerHorario(data:any){
    return this.https
    .post(AppSettings.URL_LOCAL_REQUEST+'/horario/obtenerHorarios',data)
    .pipe(
      catchError((error) => {
        console.log(error);
        return this.handleError(error);
      })
    )
  }
  
  postEliminarHorario(data:any){
    return this.https
    .post(AppSettings.URL_LOCAL_REQUEST+'/horario/eliminarHorario',data)
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
        this._notificationService.pushInfo("No hay horarios por mostrar")
      } else {
        this._notificationService.pushError(this._translate.instant('template.notificaciones.error.intentaloMasTarde'));
        this._notificationService.pushMsjResponse(error.error.lstMensajes);
      }
    }

    return throwError('ERROR');
  }
}
