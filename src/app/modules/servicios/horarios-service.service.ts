import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationService } from './core/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'src/app/settings.const';
import { catchError, map, throwError } from 'rxjs';
import { Dia, Horas } from '../componentes/asignar-asesoria/asignar-asesoria.component';

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
  postObtenerDiasAtencion(idAsesor:any){
    let params = new HttpParams().set('int_Id_Asesor', idAsesor.toString());

    return this.https
    .post<{dias: Dia[]}>(AppSettings.URL_LOCAL_REQUEST+'/horario/obtenerDiasHorarios',null,{ params })
    .pipe(
      map(response => response.dias),
      catchError((error) => {
        console.log(error);
        return this.handleError(error);
      })
    )
  }

  getHorasPorDia(idAsesor: any, diaSemana:any, fechaCorta:any){
    let params = new HttpParams()
                     .set("int_Id_Asesor", idAsesor)
                     .set("str_Dia", diaSemana.toString())
                     .set("date_Fecha",fechaCorta.toString());
    return this.https                 
    .post<{horas: Horas[]}>(AppSettings.URL_LOCAL_REQUEST+"/horario/horasDeAtencionDiaria",null,{params})
    .pipe(
      map(response => response.horas),
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
