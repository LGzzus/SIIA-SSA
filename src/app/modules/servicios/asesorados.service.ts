import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from './core/notification.service';
import { AppSettings } from 'src/app/settings.const';
import { catchError, map, Subject, throwError, Observable, tap } from 'rxjs';
import { Asesorados } from '../componentes/lista-asistencia/lista-asistencia.component';

@Injectable({
  providedIn: 'root'
})
export class AsesoradosService {

  private _refresh$ = new Subject<void>() 
  constructor(private https: HttpClient, protected _notificationService: NotificationService,
    private _translate: TranslateService) { }

  getListaAsistencias(idAsesoria: any) {
    let params = new HttpParams()
      .set("idAsesoria", idAsesoria);
    console.log(params);

    return this.https
      .post<{ message: string, alumnos: Asesorados[] }>(AppSettings.URL_LOCAL_REQUEST + '/asesoriasAsignacion/AlumnosAsesoria', null, { params })
      .pipe(
        map(response => response.alumnos),
        catchError((error) => {
          console.log(error);
          return this.handleError(error);
        })
      )
  }

  get refresh$(){
    return this._refresh$;
  }

  postAsistenciaAsesoria(idAsignacionAsesoria: any): Observable<Object>{
    let params = new HttpParams()
    .set("idAsignacion", idAsignacionAsesoria);
    console.log(params)
    return this.https.post(AppSettings.URL_LOCAL_REQUEST+'/asesoriasAsignacion/asistenciaAsesoria',null,{params})
    .pipe(
        tap(() =>{
          this._refresh$.next();
        }),
      catchError((error)=>{
        console.log(error)
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
