import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServicesService {

  constructor() { }
  private listPrivilegiosSource = new BehaviorSubject<string | null>(null);
  currentListPrivilegios = this.listPrivilegiosSource.asObservable();

  private idAsesorSource = new BehaviorSubject<string | null>(null);
  currentIdAsesor = this.idAsesorSource.asObservable();

  private esTutor = new BehaviorSubject<boolean  | null>(null);
  currentEsAsesor = this.esTutor.asObservable();

  changeListPrivilegios(listPrivilegios: string) {
    this.listPrivilegiosSource.next(listPrivilegios);
  }

  changeIdAsesor(idAsesor: string) {
    this.idAsesorSource.next(idAsesor);
  }

  asignarEsTutor(esAsesor : true){
    this.esTutor.next(esAsesor);
  }
}
