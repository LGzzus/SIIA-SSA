import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationService } from './core/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'src/app/settings.const';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Docente } from '../componentes/asingacion-rol-docenctes/asingacion-rol-docenctes.component';
import { Asesor } from '../componentes/listar-docentes/listar-docentes.component';


@Injectable({
  providedIn: 'root'
})
export class SolicitudesServicesService {

  constructor(private https: HttpClient, protected _notificationService: NotificationService,
    private _translate: TranslateService) { }

  postSolicitudesPendientes(asesorVO: any){
    return this.https
      .post(AppSettings.URL_LOCAL_REQUEST + '/solicitud/solicitudesPendientes?lngIdPersona='+asesorVO,{})
      .pipe(
        catchError((error) => {
          console.log(error);
          return this.handleError(error);
        })
      )
  }
  postAceptarSolicitud(solicitudVO: any){
    return this.https
      .post(AppSettings.URL_LOCAL_REQUEST + '/solicitud/firmarSolicitud?idSolicitud='+solicitudVO.idSolicitud,{},
        {responseType: 'blob'})
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
      } else if (error.status === 409) {
        this._notificationService.pushInfo("Ya cuenta con el rol de Asesor")
      } else {
        this._notificationService.pushError(this._translate.instant('template.notificaciones.error.intentaloMasTarde'));
        this._notificationService.pushMsjResponse(error.error.lstMensajes);
      }
    }

    return throwError('ERROR');
  }
}
