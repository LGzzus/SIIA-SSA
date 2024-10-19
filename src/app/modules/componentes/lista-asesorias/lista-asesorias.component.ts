import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AsignacionAsesoriaService } from '../../servicios/asignacion-asesoria.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

export interface Asesoria {
  strDia: string;
  dateDiaAsesoria: Date;
  timeHoraFin: string;
  timeHoraInicio: string;
  tipoAsesoria: string;
  statusAtencion: boolean;
}
@Component({
  selector: 'app-lista-asesorias',
  templateUrl: './lista-asesorias.component.html',
  styleUrls: ['./lista-asesorias.component.css']
})
export class ListaAsesoriasComponent implements OnInit,AfterViewInit{

  dataAsesor: any = {}
  idAsesor: any;
  str_Id_Periodo: any;
  asesorias: Asesoria[] = [];
  asesorias2 : any = {};
  dataSourceAsesorias = new MatTableDataSource<Asesoria>(this.asesorias)
  displayColumns: string[] = ["strDia", "dateDiaAsesoria", "timeHoraIF", "tipoAsesoria", "statusAtencion","acciones"];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _asesoriaService: AsignacionAsesoriaService,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void{
    this.route.queryParams.subscribe(params => {
      this.idAsesor = params["idAsesor"];
      this.str_Id_Periodo = params["periodo"];
      
      console.log(this.idAsesor);
      console.log(this.str_Id_Periodo);

    })

    this._asesoriaService.getAsesorias(this.idAsesor, this.str_Id_Periodo).subscribe((response) => {  
      this.asesorias = response;
      this.dataSourceAsesorias.data = this.asesorias;
      this.dataSourceAsesorias.paginator = this.paginator;
    });
  }
  ngAfterViewInit(): void {
    this.dataSourceAsesorias.paginator = this.paginator;
  }
}
