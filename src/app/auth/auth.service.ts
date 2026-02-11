import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constantesApiWeb } from '@apiVariables';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private http : HttpClient) { }

   obtenerItemsTabla(id:number) {
        const url = `${constantesApiWeb.lstItemsTabla}${id}`;
        return this.http.get<any>(url);
    }

    traerunoEvento(id:any) {
        const url = `${constantesApiWeb.traerunoEvento}${id}`;
        return this.http.get<any>(url);
    }

    Confirmadosevento(objeto:any) {
        const url = `${constantesApiWeb.Confirmadosevento}`;
        return  this.http.post<any>(url, objeto)
    }

    revisoCorreo(objeto:any) {
        const url = `${constantesApiWeb.revisoCorreo}`;
        return  this.http.post<any>(url, objeto)
    }
}
