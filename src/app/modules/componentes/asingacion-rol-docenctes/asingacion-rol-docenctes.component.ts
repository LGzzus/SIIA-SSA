import { Component, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CombosServiceService } from '../../servicios/combos-service.service';
import { DocentesService } from '../../servicios/docentes.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NotificationService } from '../../servicios/core/notification.service';

export interface Docente{
  id: number,
  nombre: string
}
@Component({
  selector: 'app-asingacion-rol-docenctes',
  templateUrl: './asingacion-rol-docenctes.component.html',
  styleUrls: ['./asingacion-rol-docenctes.component.css']
})
export class AsingacionRolDocenctesComponent {


  @Output()
  hide = true;
  docentesData: Docente[] = [];
  periodos: any = {};
  pe: any = {};
  displayColumns: string[] = ['id', 'nombre', 'asignarRol'];
  dataSource = new MatTableDataSource<Docente>(this.docentesData);
  responseData : any;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  datosExtraerDocenetes = this._formBuilder.group({
    idProgEducativo: new FormControl('', [Validators.required]),
    idPeriodo: new FormControl('', [Validators.required])
  })

  constructor(
    private _periodoService : CombosServiceService,
    private _docentesService: DocentesService,
    private _formBuilder: FormBuilder,
    private _notificationService : NotificationService,

  ) { }

  ngOnInit(): void {

    const singleusuario = {
      strUsuario: sessionStorage.getItem('strLoginUsuarioLog')
    }
    this._periodoService.getPeriodos().subscribe(perido => {
      this.periodos = perido
    })
    this._periodoService.getProgramasEducativos(singleusuario).subscribe(pEducativo => {
      this.pe = pEducativo
    })
    let asesorVO = {
      strNBTutor: sessionStorage.getItem('strNombreCompleto')
    }
    this._docentesService.postTieneRolAsesor(asesorVO).subscribe( bol => {
      console.log(bol)
      if(bol){
        let listPriv = sessionStorage.getItem('listPrivilegios');
        listPriv = listPriv + ",Asesor";
        sessionStorage.setItem('listPrivilegios',listPriv)
      }
    })
  }
  
  formSubmit() {
    const dataIds = {
      intIdPrograma: this.datosExtraerDocenetes.value.idProgEducativo,
      strIdPeriodo: this.datosExtraerDocenetes.value.idPeriodo
    }
    console.log(dataIds)
    if (this.datosExtraerDocenetes.valid) {
      this._docentesService.getDocentesProgamaEdu(dataIds).subscribe((docentes) => {
        this.docentesData = docentes
        this.dataSource.data = this.docentesData;
        this.dataSource.paginator = this.paginator;

      })
    }
  }

  asignateRoleAsesor(row: any){
    console.log(row.strNbTutor);
    
    const dataIds = {
      strNBTutor: row.strNbTutor,
      intIdPrograma: this.datosExtraerDocenetes.value.idProgEducativo,
      strIdPeriodo: this.datosExtraerDocenetes.value.idPeriodo
    }
    console.log(dataIds);
    
    this._docentesService.postDocentesRolAsesor(dataIds).subscribe(response => {
      this.responseData = response

      if(this.responseData.statusCode === 200){
        this._notificationService.pushSuccess(this.responseData.message)
      }else{
        this._notificationService.pushInfo(this.responseData.error)
      }
    })
  }
}
