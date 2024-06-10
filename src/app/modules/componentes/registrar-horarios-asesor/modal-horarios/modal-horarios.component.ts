import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'src/app/modules/servicios/core/notification.service';
import { HorarioService } from 'src/app/modules/servicios/horarios-service.service';

@Component({
  selector: 'app-modal-horarios',
  templateUrl: './modal-horarios.component.html',
  styleUrls: ['./modal-horarios.component.css']
})
export class ModalHorariosComponent {
  @Output() horarioRegistrado = new EventEmitter<void>();
  listDias: any = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
  response: any;

  constructor(
    public _formBuilder: FormBuilder,
    private dialog: MatDialogRef<Component>,
    private _horarioService: HorarioService,
    private _notificationService : NotificationService,
    @Inject(MAT_DIALOG_DATA) public horarioData: any
  ) { }

  ngOnInit() {
    if (this.horarioData) {
      this.horarioDataForm.setValue({
        dia: this.horarioData?.str_Dia || '',
        horaInicio: this.horarioData?.time_Hora_Inicio || '',
        horaFin: this.horarioData?.time_Hora_Fin || ''
      });
    }
  }
  horarioDataForm = this._formBuilder.group({
    dia: new FormControl('', [Validators.required]),
    horaInicio: new FormControl('', [Validators.required]),
    horaFin: new FormControl('', [Validators.required])
  })

  registrarHorarioSubmit() {
    let fieldFormHorarios = {};
    if (this.horarioData && this.horarioData.int_Id_Horario !== null) {
      fieldFormHorarios = {
        int_Id_Asesor: sessionStorage.getItem("id_Asesor"),
        int_Id_Horario: this.horarioData.int_Id_Horario,
        str_Dia: this.horarioDataForm.value.dia,
        time_Hora_Inicio: this.horarioDataForm.value.horaInicio,
        time_Hora_Fin: this.horarioDataForm.value.horaFin
      };
    } else {
      fieldFormHorarios = {
        int_Id_Asesor: sessionStorage.getItem("id_Asesor"),
        str_Dia: this.horarioDataForm.value.dia,
        time_Hora_Inicio: this.horarioDataForm.value.horaInicio,
        time_Hora_Fin: this.horarioDataForm.value.horaFin
      };
    }
    if (this.horarioDataForm.valid) {
      this._horarioService.postRegistrarHorario(fieldFormHorarios).subscribe(response => {
        this.response = response;
        console.log(response);
        
        if (this.response.status == 200) {
          this._notificationService.pushInfo(this.response.mensaje)
          this.horarioRegistrado.emit();
          this.dialog.close();
        }
      });
    }
  }

}
