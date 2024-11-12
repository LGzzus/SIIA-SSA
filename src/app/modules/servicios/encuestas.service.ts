import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationService } from './core/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';
import { AppSettings } from 'src/app/settings.const';
import { catchError, map, throwError } from 'rxjs';
import { Encuesta } from '../componentes/encuestas/encuestas.component';

@Injectable({
  providedIn: 'root'
})
export class EncuestasService {

  constructor(private https: HttpClient, protected _notificationService: NotificationService,
    private _translate: TranslateService) { }

    encuestasPendientes(str_Matricula: any){
      let params = new HttpParams()
      .set("str_Matricula",str_Matricula);

      console.log(params);

      return this.https.post(AppSettings.URL_LOCAL_REQUEST + '/asesoriaEncuastas/encuestasPendientes',null,{params})
      .pipe(
        catchError((error) => {
        console.log(error);
        return this.handleError(error);
        })
      );
    }

    listaEncuestas(data: any){
      let params = new HttpParams()
      .set("idProgramaEducativo",data.intIdPrograma)
      .set("str_Periodo",data.strIdPeriodo)
      .set("str_Matricula",data.strMatricula);

      return this.https
      .post<Encuesta[]>(AppSettings.URL_LOCAL_REQUEST + '/asesoriaEncuastas/listaEncuestas', null,{params})
      .pipe(
        map(response => response),
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
