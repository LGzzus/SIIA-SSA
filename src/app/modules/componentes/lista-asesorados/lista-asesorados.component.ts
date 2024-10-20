import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsesoradosService } from '../../servicios/asesorados.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
export interface Asesorados{
  id_Asesoria_Asignacion: number,
  id_Asesoria: number,
  id_Asesor: number,
  str_Matricula_Alumno: string
}
@Component({
  selector: 'app-lista-asesorados',
  templateUrl: './lista-asesorados.component.html',
  styleUrls: ['./lista-asesorados.component.css']
})
export class ListaAsesoradosComponent implements OnInit{
  /* Variablessssssssssssssss inicio */
  idAsesoria: any;
  asesorados: Asesorados[] = [];
  dataSourceAsesorados = new MatTableDataSource<Asesorados>(this.asesorados);

  displayColumns: string[] = ["Nombre", "Matricula", "Asistencia","Acciones"];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  /* Variablessssssssssssssss fin */
  constructor(
    private route: ActivatedRoute,
    private _asesoradosServices: AsesoradosService
  ){}
  ngOnInit(): void{    
    this.route.queryParams.subscribe( params => {
      this.idAsesoria = params["idAsesoria"];
      console.log(this.idAsesoria);
    })

    this._asesoradosServices.getAsesoradosAsesorias(this.idAsesoria).subscribe((response) => {
      this.asesorados = response;
      console.log(this.asesorados);
      this.dataSourceAsesorados.data = this.asesorados;
      this.dataSourceAsesorados.paginator = this.paginator;
    });
  }
}
