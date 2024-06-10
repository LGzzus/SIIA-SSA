import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from "../servicios/core/auth-guard.service";

//LOGIN
import { LoginComponent } from '../componentes/login/login.component';
import { HomeComponent } from '../componentes/home/home.component';
import { AsingacionRolDocenctesComponent } from '../componentes/asingacion-rol-docenctes/asingacion-rol-docenctes.component';
import { ListarDocentesComponent } from '../componentes/listar-docentes/listar-docentes.component';
import { RegistrarHorariosAsesorComponent } from '../componentes/registrar-horarios-asesor/registrar-horarios-asesor.component';

const routes: Routes = [
  { path: "", redirectTo: 'login', pathMatch: "full"},
  { path: "login", component: LoginComponent, pathMatch: "full"},
  { path: "inicio", component: HomeComponent, pathMatch: "full", canActivate:[AuthGuardService]}, //canActivate: [AuthGuardService] 
  { path: "asignarRolDocente", component: AsingacionRolDocenctesComponent, pathMatch:"full"},
  { path: "listaAsesores", component: ListarDocentesComponent, pathMatch: "full"},
  { path: "registrarHorario", component: RegistrarHorariosAsesorComponent, pathMatch: "full"}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { };
