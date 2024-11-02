import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaAsistenciaComponent } from './lista-asistencia.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [ListaAsistenciaComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    AppRoutingModule
  ]
})
export class ListaAsistenciaModule { }
