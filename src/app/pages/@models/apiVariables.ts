import { environment } from "src/environments/environment";

const webApi = environment.webAPI;

const controllerMain: string = webApi+'Main';
const controllerEventos: string = webApi +'Evento'

export const constantesApiWeb = { 
    lstItemsTabla: controllerMain + '/listaritems/',    
    traerunoEvento: controllerEventos + '/eventoTraerUno/',
    Confirmadosevento: controllerEventos + '/confirmadosevento',
    revisoCorreo: controllerEventos + '/revisocorreo',
}
