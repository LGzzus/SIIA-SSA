import { Component, Output, ViewChild } from '@angular/core';
import { CombosServiceService } from '../../servicios/combos-service.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DocentesService } from '../../servicios/docentes.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

export interface Asesor {
  idAsesor: number,
  strNombre: string,
  areasApoyo: string
}

@Component({
  selector: 'app-listar-docentes',
  templateUrl: './listar-docentes.component.html',
  styleUrls: ['./listar-docentes.component.css']
})
export class ListarDocentesComponent {

  @Output()
  hide = true;
  displayColumns: string[] = ["idAsesor", "strNombre", "areasApoyo", "acciones"]
  periodos: any = {};
  pe: any = {};
  asesoresData: Asesor[] = [];
  dataSource = new MatTableDataSource<Asesor>(this.asesoresData); 

  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataFormulario = this._formBuilder.group({
    idProgEducativo: new FormControl('', [Validators.required]),
    idPeriodo: new FormControl('', [Validators.required]),
    strNombre: new FormControl('')
  })

  constructor(
    private _combosServices: CombosServiceService,
    private _formBuilder: FormBuilder,
    private _docentesService : DocentesService,
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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  obtenerDocentesSubmit() {
    const dataForm = {
      intIdPrograma: this.dataFormulario.value.idProgEducativo,
      strIdPeriodo: this.dataFormulario.value.idPeriodo,
      strNBTutor: this.dataFormulario.value.strNombre
    }
    console.log(dataForm);
    if (this.dataFormulario.valid){
      this._docentesService.postBuscarDocentes(dataForm).subscribe((asesores) => {
        this.asesoresData = asesores;
        console.log(this.asesoresData)
        this.dataSource.data = this.asesoresData
        this.dataSource.paginator = this.paginator
      })
    }
    
  }
}
