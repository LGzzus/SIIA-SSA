import { Component } from '@angular/core';
import { CombosServiceService } from '../../servicios/combos-service.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EncuestasService } from '../../servicios/encuestas.service';
import { MatTableDataSource } from '@angular/material/table';

  export interface Encuesta{
    //id_Asesoria_Encuesta=1, id_Asesoria_Asignacion=1, id_Encuesta=1, date_Fecha_Asignacion=2024-11-04 12:11:17.0, timestap_Fecha_Actualizacion=null, boolean_Respondida=false)
    idAsesoria : number,
    idAsesoriaAsignacion: number,
    idEncuesta: number,
    fechaApertura: String
  }
@Component({
  selector: 'app-encuestas',
  templateUrl: './encuestas.component.html',
  styleUrls: ['./encuestas.component.css']
})
export class EncuestasComponent {
  periodos: any = {};
  pe: any = {};
  encuestaData: Encuesta[] = [];
  dataSourceEncuestas = new MatTableDataSource(this.encuestaData)
  displayColumns: string[] = ["idEvaluacion", "fechaAsesoria", "asesor", "fechaApertura","responderEncuesta"]


  dataFormulario = this._formBuilder.group({
    idProgEducativo: new FormControl('', [Validators.required]),
    idPeriodo: new FormControl('', [Validators.required]),
  })


  constructor(
    private _combosServices: CombosServiceService,
    private _formBuilder: FormBuilder,
    private _encuestasService : EncuestasService,
    private router: Router
  ) { }
  ngOnInit(): void {
    const singleusuario = {
      strUsuario: sessionStorage.getItem('strLoginUsuarioLog')
    }
    this._combosServices.getPeriodos().subscribe(perido => {
      this.periodos = perido
    })
    this._combosServices.getProgramasEducativos(singleusuario).subscribe(pEducativo => {
      this.pe = pEducativo
    })
  }

  getEncuestas(){
    const dataForm = {
      intIdPrograma: this.dataFormulario.value.idProgEducativo,
      strIdPeriodo: this.dataFormulario.value.idPeriodo,
      strMatricula: sessionStorage.getItem("strLoginUsuarioLog")
    }
    console.log(this.dataFormulario);
    
    if(this.dataFormulario.valid){
      this._encuestasService.listaEncuestas(dataForm).subscribe((encuestas) => {
        console.log(encuestas);
        
        this.encuestaData = encuestas;
        this.dataSourceEncuestas.data = this.encuestaData;

      })
    }
  }
}
