import { Component, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { CombosServiceService } from '../../servicios/combos-service.service';
import { DocentesService } from '../../servicios/docentes.service';
import { HorarioService } from '../../servicios/horarios-service.service';
import { relativeTimeRounding } from 'moment';
import { AsignacionAsesoriaService } from '../../servicios/asignacion-asesoria.service';
import { NotificationService } from '../../servicios/core/notification.service';

export interface Asesor {
  idAsesor: number,
  strNombre: string,
  areasApoyo: string
}

export interface Dia{
  dia: string
}
export interface Horas{
  horas: string
}

export interface Tutorados{
  idTutorado: number,
  strNombreCompleto: string,
  strMatricula: string
}
@Component({
  selector: 'app-asignar-asesoria',
  templateUrl: './asignar-asesoria.component.html',
  styleUrls: ['./asignar-asesoria.component.css']
})
export class AsignarAsesoriaComponent {
  @Output()
  hide = true;
  periodos: any = {};
  pe: any = {};
  dias: any = {};
  diasUpperCase: any =[];
  nombre: any;
  idAsesor : any;
  horas: any = {};
  dataFormHL = {};
  buttonSeleccionado: boolean = false;
  responseSucces: any;
  filterDias: any;
  fechaSeleccionada: Date | null = null;

  asesoresData: Asesor[] = []; 
  tutoradosData: Tutorados[] = [];
  asesoresAgregados: Tutorados[] = [];

  displayColumns: string[] = ["idAsesor", "strNombre", "areasApoyo", "acciones"]
  displayColumnsTutorados: string[] = [ "strMatricula", "strNombreCompleto", "acciones"]
  dataSource = new MatTableDataSource<Asesor>(this.asesoresData)
  dataSourceTutorados = new MatTableDataSource<Tutorados>(this.tutoradosData)

  dataSaveAsesoria = {
    diaSeleccionado:'',
    fechaCorta:'',
    horaFin:'',
    horaInicio:'',
    idAsesor:0,
    intIdProgramaCampus:0,
    strIdPeriodo: '',
    tipoAsesoria: '',
    alumnos: [] as any[],
  };
  tipoAsesoria: string;
  isDisable = false;
  deshabilitarGrupal = false;
  disabledRows = new Set<string>(); 

  @ViewChild('paginatorAsesores') paginatorAsesores: MatPaginator;
  @ViewChild('paginatorTutorados') paginatorTutorados: MatPaginator;
  
  dataFormulario = this._formBuilder.group({
    idProgEducativo: new FormControl('', [Validators.required]),
    idPeriodo: new FormControl('', [Validators.required]),
    strNombre: new FormControl('')
  })
  constructor (private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _combosServices: CombosServiceService,
    private _docentesService : DocentesService,
    private _horarioService : HorarioService,
    private _asignacionAsesoriaService : AsignacionAsesoriaService,
    private _notificactionService: NotificationService
  ){}
  ngOnInit(): void {

    const singleusuario = {
      strUsuario: sessionStorage.getItem('strLoginUsuarioLog')
    }
    this._combosServices.getPeriodos().subscribe(perido => {
      this.periodos = perido
    })
    this._combosServices.getProgramasEducativos(singleusuario).subscribe(pEducativo => {
      this.pe = pEducativo;
    })
    //Checar esto 
    this.route.queryParams.subscribe(params => {
      this.nombre = params['nombreAsesor'];
    });
    
  }
  obtenerDocentesSubmit() {
    const dataForm = {
      intIdPrograma: this.dataFormulario.value.idProgEducativo,
      strIdPeriodo: this.dataFormulario.value.idPeriodo,
      strNBTutor: this.dataFormulario.value.strNombre
    }
    this.dataFormHL = {
      intIdProgramaCampus: this.dataFormulario.value.idProgEducativo,
      strIdPeriodo: this.dataFormulario.value.idPeriodo,
      intIdHistorialLaboral: sessionStorage.getItem("idHistorialLaboral")
    }
    this.dataSaveAsesoria.intIdProgramaCampus =  Number(this.dataFormulario.value.idProgEducativo);
    this.dataSaveAsesoria.strIdPeriodo = this.dataFormulario.value.idPeriodo??'';
    
    if (this.dataFormulario.valid){
      this._docentesService.postBuscarDocentes(dataForm).subscribe((asesores) => {
        
        this.asesoresData = asesores;
        this.dataSource.data = this.asesoresData;
        this.dataSource.paginator = this.paginatorAsesores;
      })
    }
    
  }
  asesorSeleccionado(idAsesor:number){
    this.idAsesor = idAsesor;
    this.dataSaveAsesoria.idAsesor = idAsesor
    this._horarioService.postObtenerDiasAtencion(idAsesor).subscribe( (dia) =>{
      this.dias = dia;
      this.dias.forEach((dia:string) => {
        console.log(dia);
        this.diasUpperCase.push(dia.toLowerCase())
        console.log(this.diasUpperCase);
        
      })
    })
    this.filterDias = (date: Date | null): boolean => {
      if (!date) return false;
    
      // Obtiene el nombre del día de la semana en español
      const dayName = date.toLocaleString('es-MX', { weekday: 'long' }).toLowerCase();
      
      // Verifica si la fecha es hoy o futura
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Ajusta la hora para comparar solo la fecha
      
      // Permite la selección solo si es un día de atención y la fecha es hoy o futura
      return date >= today && this.diasUpperCase.includes(dayName);
    };
    
  }
  seleccionDia(diaSeleccionado:Date){

    const optionsDay: Intl.DateTimeFormatOptions = { weekday: 'long' }; // Establece la opción para obtener el día completo
    const diaEnEspañol = diaSeleccionado.toLocaleString('es-MX', optionsDay);
    
    this.dataSaveAsesoria.diaSeleccionado = diaEnEspañol;
    
    const optionsDate: Intl.DateTimeFormatOptions = {
      year: 'numeric',   // Asegúrate de que estos sean strings
      month: '2-digit',
      day: '2-digit'
    };
    
    // Convertir el día seleccionado a una cadena en formato corto
    const fechaCorta = diaSeleccionado.toLocaleDateString('es-MX', optionsDate);
    this.dataSaveAsesoria.fechaCorta = fechaCorta;

    this._horarioService.getHorasPorDia(this.idAsesor, diaEnEspañol,fechaCorta).subscribe((horas)=>{
      this.horas = horas;
      console.log(this.horas);
      console.log(this.horas.length);
      if(this.horas.length <= 0){
        this._notificactionService.pushAlert("No existen horarios disponibles, selecciona otro dia");
      }
    })
    console.log(this.dataSaveAsesoria);
  }
  seleccionHora(horaSeleccionada:any){
    horaSeleccionada = horaSeleccionada.toString().split('-')
    console.log(horaSeleccionada);
    
    this.dataSaveAsesoria.horaInicio = horaSeleccionada[0];
    this.dataSaveAsesoria.horaFin = horaSeleccionada[1];    
    this._combosServices.postObtenerTutorados(this.dataFormHL).subscribe((tutorados) => {
      console.log(tutorados);
      
      // Asegúrate de que tutorados sea del tipo correcto
      this.tutoradosData = tutorados;
    
      // Asigna los datos a la fuente de datos de MatTableDataSource
      this.dataSourceTutorados.data = this.tutoradosData;
    
      // Asigna el paginador
      this.dataSourceTutorados.paginator = this.paginatorTutorados;
    });
    
  }
  seleccionTipoAsesoria(event:any){
    console.log(event.value);
    this.dataSaveAsesoria.tipoAsesoria = event.value;
    console.log(this.dataSaveAsesoria);

    /*if(this.dataSaveAsesoria.tipoAsesoria === 'Grupal'){
      this.isDisable = false;
    }else if(this.dataSaveAsesoria.tipoAsesoria === 'Individual'){
      this.deshabilitarGrupal = true;
      if(this.dataSaveAsesoria.alumnos.length != 0){
        alert("deberias eliminar a uno de los "+this.dataSaveAsesoria.alumnos.length )
        //disparar el cambio de icono y se habiliten
        this.disabledRows = new Set<string>();
        console.log(this.disabledRows);
        this.dataSaveAsesoria.alumnos.forEach(alumno => {
        this.isRowDisabled(alumno.strMatriculaAlumno)
      });
      }else{
        return
      }
    }*/
  }
  addTutoradoAsesoria(row: any) {
    // Verifica si se ha seleccionado un tipo de asesoría
    if (!this.dataSaveAsesoria.tipoAsesoria) {
        alert("Selecciona el tipo de asesoría");
        return;
    }
  
    // Crea el objeto alumno
    const alumnoObject = {
        strMatriculaAlumno: row.strMatricula,
        strNombreAlumno: row.strNombreCompleto
    };
    if(!this.disabledRows.has(row.strMatricula)){
      // Lógica para tipo de asesoría "Individual" o "Grupal"
      if (this.dataSaveAsesoria.tipoAsesoria === 'Individual') {
        if (this.dataSaveAsesoria.alumnos.length === 0) {
            this.dataSaveAsesoria.alumnos.push(alumnoObject);
        } else {
            alert("Ya has seleccionado un alumno. Cambiando a tipo grupal.");
            this.tipoAsesoria = "Grupal";
            this.deshabilitarGrupal = false;
            this.dataSaveAsesoria.alumnos.push(alumnoObject);
        }
      } else if (this.dataSaveAsesoria.tipoAsesoria === 'Grupal') {
          this.dataSaveAsesoria.alumnos.push(alumnoObject);
          this.disabledRows.add(row.strMatricula); // Deshabilitar el botón para el alumno agregado
      } 
    }else{
      this.disabledRows.delete(row.strMatricula);
      this.dataSaveAsesoria.alumnos = this.dataSaveAsesoria.alumnos.filter(alumno => alumno.strMatriculaAlumno !== row.strMatricula);
      console.log(this.disabledRows)
      console.log(this.dataSaveAsesoria)
    }
  }
  
  isRowDisabled(rowId: string): boolean {
    return this.disabledRows.has(rowId);
  }  

  registrarAsesoria(){
    this._asignacionAsesoriaService.postAsignacionAsesorias(this.dataSaveAsesoria).subscribe((response) => {
      this.responseSucces = response;
      console.log(response);
      this._notificactionService.pushSuccess(this.responseSucces.message);
      window.location.reload();
    })
  }

}
