import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationService } from './core/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'src/app/settings.const';
import { catchError, map, throwError } from 'rxjs';
import { Tutorados } from '../componentes/asignar-asesoria/asignar-asesoria.component';

@Injectable({
  providedIn: 'root'
})
export class CombosServiceService {

  token = sessionStorage.getItem("token");

  constructor(private https: HttpClient, protected _notificationService: NotificationService,
    private _translate: TranslateService) { }

  getPeriodos = () => {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.token });
    return this.https
      .get(AppSettings.URL_MIDDELWARE + 'obtPeriodos', { headers: headers })
      .pipe(
        catchError((error) => {
          console.log(error);
          return this.handleError(error);
        })
      )
  };

  getProgramasEducativos(usuario:any){
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.token });
    return this.https
      .post(AppSettings.URL_MIDDELWARE + 'obtProgramas',usuario,  { headers: headers })
      .pipe(
        catchError((error) => {
          console.log(error);
          return this.handleError(error);
        })
      )
  };

  postObtenerTutorados(data: any){
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.token });
    return this.https
      .post<Tutorados[]>(AppSettings.URL_MIDDELWARE+'verTutorados',data,{headers: headers})
      .pipe(
        catchError((error) => {
          console.log(error);
          return this.handleError(error);
        })
      )
  }
  /*UsuarioLogueo(usuario:any): Observable<any> {
    return this._http.post(
      AppSettings.API_ENDPOINT + '/siia-back-comun-0.0.1-SNAPSHOT/public/serviciosUniversitarios/authenticate',usuario
    ).pipe(
      catchError(error => {
        console.log(error);
        return this.handleError(error);
      })
    );
  }*/
  protected handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      this._notificationService.pushError(this._translate.instant('template.notificaciones.error.comunicacion'));
    } else {
      if (error.status === AppSettings.CODE_WRONG_REQUEST) {
        this._notificationService.pushError(this._translate.instant('template.notificaciones.error.solicitudErronea'));
      } else if (error.status === AppSettings.CODE_WITHOUT_AUTHORIZATION) {
        this._notificationService.pushError(this._translate.instant('template.notificaciones.error.solicitudNoAutorizada'));
      } else {
        this._notificationService.pushError(this._translate.instant('template.notificaciones.error.intentaloMasTarde'));
        this._notificationService.pushMsjResponse(error.error.lstMensajes);
      }
    }

    return throwError('ERROR');
  }
}
