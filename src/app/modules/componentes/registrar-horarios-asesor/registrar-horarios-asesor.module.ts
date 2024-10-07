import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { RegistrarHorariosAsesorComponent } from './registrar-horarios-asesor.component';

import { MatDialogModule } from '@angular/material/dialog';
import { ModalHorariosComponent } from './modal-horarios/modal-horarios.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatCard, MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    RegistrarHorariosAsesorComponent,
    ModalHorariosComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    NgxMatTimepickerModule,
    MatCardModule,
    ReactiveFormsModule,
    MatCardModule
  ]
})
export class RegistrarHorariosAsesorModule { }
