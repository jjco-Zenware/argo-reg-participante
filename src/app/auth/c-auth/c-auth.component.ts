import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mensajesQuestion } from '@constantes';
import { SharedAppService } from '@sharedAppService';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-c-auth',
  templateUrl: './c-auth.component.html',
  styleUrls: ['./c-auth.component.scss']
})
export class CAuthComponent implements OnInit {
   $listSubcription: Subscription[] = [];
    param: any;
    registerForm!: FormGroup;
    headerTitle?: string;
    lstTipoDocPer:any[] = [];
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    detEvento?:string;
    //idEvento: number = 0;
    errorMensaje!: string;
    onlyRead: boolean = false;
    vistaLista: boolean = true;
    visDetalle: boolean = false;

 
   constructor(
     public refDatoItem: DynamicDialogRef,
     public config: DynamicDialogConfig,
     public dialogService: DialogService,
     private messageService: MessageService,
     private formBuilder: FormBuilder,
     private administracionService: AuthService,
     private serviceSharedApp: SharedAppService, 
     private router: ActivatedRoute
   ) { }
 
 
   ngOnInit(): void {
    
    this.router.paramMap.subscribe((params) => {
      this.param = params.get('id');
      
      console.log('parametro : ', this.param);
    })

     this.createFormCliente();
     this.listaTipoDocumentoPersona();
     this.traerUnoEvento();
     //this.revisoCorreo();
   }
 
   ngOnDestroy() {
     if (this.$listSubcription != undefined) {
       this.$listSubcription.forEach((sub) => sub.unsubscribe());
     }
   }
 
   setSpinner(valor: boolean) {
   this.blockedDocument = valor;
   }
 
   createFormCliente() {
     //Agregar validaciones de formulario
     this.registerForm = this.formBuilder.group({
     idcontacto: [{ value: 0, disabled: false }],
     idevento: [{ value: this.param, disabled: false }],
     nomcontacto: [{ value: null, disabled: false }],
     apellidocontacto: [{ value: null, disabled: false }],
     cargo: [{ value: null, disabled: false }],
     telefono :  [{ value: null, disabled: false }],
     email: ['', [Validators.required, Validators.email]],
     indvig:  [{ value: true, disabled: false }],
     idtipodoc:  [{ value: null, disabled: false }],
     nrodocumento:  [{ value: null, disabled: false }],
     empresa:  [{ value: null, disabled: false }],
     });
 }
 
 
 
 guardarParticipante() {
       console.log('guardarParticipante...', this.registerForm.getRawValue());

       this.setSpinner(true);
       this.mensajeSpinner = "Guardando Datos...";
 
       if (this.validarDatos())
     {
         this.setSpinner(false);
         this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
         return;
     }
 
 
     
           this.administracionService.Confirmadosevento(this.registerForm.getRawValue())
               .subscribe({
               next: (rpta:any) => {
                   console.log("rpta prcClientes : ", rpta);
                   this.setSpinner(false);
                   if (rpta.procesoSwitch == 0){
                       this.messageService.add({severity: 'success', detail: "Operación exitosa" });
                       this.registerForm.get('idpersona')?.setValue(rpta.resultProceso);
                       this.onlyRead = true
                       this.vistaLista = false;
                        this.visDetalle = true;
                       }else{
                           this.messageService.add({severity: 'warn', detail: rpta.mensaje });
                       }
               },
               error:(err)=>{
                   console.error('error : ',err)
                   this.setSpinner(false);
                   this.messageService.clear();
                   this.messageService.add({
                       severity: 'error',
                       summary: 'Error',
                       detail: mensajesQuestion.msgErrorGenerico
                   })
               },
               complete:() => {}
               });
       
   }
 
   listaTipoDocumentoPersona() {
     this.administracionService.obtenerItemsTabla(118).subscribe({
         next: (rpta: any) => {
           this.lstTipoDocPer = rpta.filter((x: { coditem: string; }) => x.coditem != 'RUC');
         },
         error: (err) => {
         console.info('error : ', err);
         this.serviceSharedApp.messageToast()
         },
         complete: () => {
         },
     });
 
     }
 
     cambioTipoDoc(dato: any) {
       if (dato == 'RUC') {
           //this.idtipodoc
       }else{
           //this.cliente.tipopersona == 'N';
       }
     }
 
     traerUnoEvento() {
       this.setSpinner(true);
       this.mensajeSpinner = "Cargando Datos...";
       const $getClientes = this.administracionService.traerunoEvento(this.param).subscribe({
         next: (rpta: any) => {
           console.log('rpta traerunoEvento : ', rpta);
           this.headerTitle = rpta.evento[0].titulo;
           this.detEvento = rpta.evento[0].lugarevento +" - "+rpta.evento[0].fecevento +" - "+ rpta.evento[0].horareg ;
           this.setSpinner(false);
         },
         error: (err) => {
           this.setSpinner(false);
           this.serviceSharedApp.messageToast()
         },
         complete: () => { this.setSpinner(false);},
       });
       this.$listSubcription.push($getClientes);
 
     }
 
     validarDatos():boolean{
     let _error = false;
     this.errorMensaje="";
     console.log('this.formValue...', this.registerForm.value);
 
     if (this.registerForm.value.nomcontacto === '' || this.registerForm.value.nomcontacto === null)
       {
           this.errorMensaje="Ingresar Nombre...!";
           _error = true;
       }
 
     if (!_error && (this.registerForm.value.apellidocontacto === null || this.registerForm.value.apellidocontacto === '')) 
       {
         this.errorMensaje="Ingresar Apellido...!";
               _error = true;
       }
 
       if (!_error && (this.registerForm.value.idtipodoc === null || this.registerForm.value.idtipodoc === '')) 
       {            
         this.errorMensaje="Seleccionar Tipo Documento...!";
             _error = true;
       }
 
     if (!_error && (this.registerForm.value.nrodocumento === '' || this.registerForm.value.nrodocumento === null))
       {
           this.errorMensaje="Ingresar Número de Documento...!";
           _error = true;
       }
 
     if (!_error && (this.registerForm.value.cargo === null ||this.registerForm.value.cargo ==='' ))
     {
         this.errorMensaje="Ingresar Cargo...!";
         _error = true;
     }
 
     if (!_error && (this.registerForm.value.empresa === null || this.registerForm.value.empresa === ''))
     {
         this.errorMensaje="Ingresar Empresa...!";
         _error = true;
     }
 
     if (!_error && (this.registerForm.value.telefono === null || this.registerForm.value.telefono === '' ))
       {
           this.errorMensaje="Ingresar Celular...!";
           _error = true;
       }
 
  if (!_error && (this.registerForm.value.email === null || this.registerForm.value.email === '' ))
       {
           this.errorMensaje="Ingresar Correo...!";
           _error = true;
       }
         
 
     return _error;
     }
   
  //    revisoCorreo() {

  //     const objeto = {
  //       idevento: this.param,
  //       email: 'jjcastilloo79@gmail.com'
  //     }

  //          this.administracionService.revisoCorreo(objeto)
  //              .subscribe({
  //              next: (rpta:any) => {
  //                  console.log("rpta prcClientes : ", rpta);
  //              },
  //              error:(err)=>{
  //                  console.error('error : ',err)
  //                  this.setSpinner(false);
  //                  this.messageService.clear();
  //                  this.messageService.add({
  //                      severity: 'error',
  //                      summary: 'Error',
  //                      detail: mensajesQuestion.msgErrorGenerico
  //                  })
  //              },
  //              complete:() => {}
  //              });
       
  //  }
  
}
