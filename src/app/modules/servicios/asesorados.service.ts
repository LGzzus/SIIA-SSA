import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from './core/notification.service';
import { AppSettings } from 'src/app/settings.const';
import { catchError, map, throwError } from 'rxjs';
import { Asesorados } from '../componentes/lista-asesorados/lista-asesorados.component';

@Injectable({
  providedIn: 'root'
})
export class AsesoradosService {

  constructor(private https: HttpClient, protected _notificationService: NotificationService,
    private _translate: TranslateService) { }

    getAsesoradosAsesorias(idAsesoria: any){
      let params = new HttpParams()
                     .set("idAsesoria", idAsesoria);
    console.log(params);

    return this.https
    .post<{message: string, alumnos: Asesorados[]}>(AppSettings.URL_LOCAL_REQUEST+'/asesoriasAsignacion/AlumnosAsesoria',null,{params})
    .pipe(
      map(response => response.alumnos),
      catchError((error) =>{
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
