import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalHorariosComponent } from './modal-horarios/modal-horarios.component';
import { HorarioService } from '../../servicios/horarios-service.service';

@Component({
  selector: 'app-registrar-horarios-asesor',
  templateUrl: './registrar-horarios-asesor.component.html',
  styleUrls: ['./registrar-horarios-asesor.component.css']
})
export class RegistrarHorariosAsesorComponent implements OnInit {

  public response: any;
  public listHorarios: any;

  constructor(
    private _horarioService: HorarioService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.cargarHorarios();
  }

  cargarHorarios() {
    const asesorVO = {
      int_Id_Asesor: sessionStorage.getItem("id_Asesor")
    };
    this._horarioService.postObtenerHorario(asesorVO).subscribe(response => {
      this.response = response;
      this.listHorarios = this.response.horarios;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalHorariosComponent);

    dialogRef.componentInstance.horarioRegistrado.subscribe(() => {
      this.cargarHorarios();
    });
  }

  openDialogEditar(horarioData: any): void {
    const dialogRef = this.dialog.open(ModalHorariosComponent, {
      data: horarioData,
    });

    dialogRef.componentInstance.horarioRegistrado.subscribe(() => {
      this.cargarHorarios();
    });
  }

  eliminarHorario(horarioData: any): void {
    const horarioDataElim = {
      int_Id_Horario: horarioData.int_Id_Asesor,
      int_Id_Asesor: sessionStorage.getItem("id_Asesor"),
      str_Dia: horarioData.str_Dia,
      time_Hora_Inicio: horarioData.time_Hora_Inicio,
      time_Hora_Fin: horarioData.time_Hora_Fin
    };
    this._horarioService.postEliminarHorario(horarioDataElim).subscribe(response => {
      this.response = response;
      this.cargarHorarios();
    });
  }
}
