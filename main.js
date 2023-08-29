//Gestion de Fechas
function padZero(value) {
    return value < 10 ? `0${value}` : value;
  }
// Obtener la fecha actual (hoy)
const fechaHoy = new Date();
const fechaMañana =new Date(fechaHoy+1);
// Formatear la fecha actual al formato "YYYY-MM-DD"
const year = fechaHoy.getFullYear();
const month = padZero(fechaHoy.getMonth() + 1);
const day = padZero(fechaHoy.getDate());
const fechaFormateada = `${year}-${month}-${day}`;
document.getElementById('early').value = fechaFormateada;
document.getElementById('late').value = fechaFormateada;

function convertirFechaHora(fechaHoraString) { 
    // Dividir la cadena en fecha y hora
    const [fecha, hora] = fechaHoraString.split(" ");
    // Formatear la fecha
    const fechaFormateada = fecha.replace(/-/g, "");
    // Formatear la hora
    const horaFormateada = hora.replace(/:/g, "");
    // Combinar fecha y hora formateadas
    const resultado = fechaFormateada + horaFormateada;
    return resultado;
  }
//Fin de Gestión de Fechas




//Plantillas XML
var XMLheader = "<?xml version='1.0' encoding='UTF-8'?> <otm:Transmission xmlns:otm='http://xmlns.oracle.com/apps/otm/transmission/v6.4' xmlns:gtm='http://xmlns.oracle.com/apps/gtm/transmission/v6.4'> <otm:TransmissionHeader/> <otm:TransmissionBody> "
var orHeader = "<otm:GLogXMLElement> <otm:Release> <otm:ReleaseGid> <otm:Gid> <otm:DomainName>#dominio</otm:DomainName> <otm:Xid>#xid</otm:Xid> </otm:Gid> </otm:ReleaseGid> <otm:TransactionCode>IU</otm:TransactionCode> <otm:ReleaseHeader> <otm:ReleaseMethodGid> <otm:Gid> <otm:DomainName>#dominio</otm:DomainName> <otm:Xid>#config</otm:Xid> </otm:Gid> </otm:ReleaseMethodGid> <!-- <otm:FixedItineraryGid> <otm:Gid> <otm:DomainName>#dominio</otm:DomainName> <otm:Xid>#itinerario</otm:Xid> </otm:Gid> </otm:FixedItineraryGid> --> <otm:IsSplitAllowed>Y</otm:IsSplitAllowed> </otm:ReleaseHeader> <otm:ShipFromLocationRef> <otm:LocationRef> <otm:LocationGid> <otm:Gid> <otm:DomainName>#dominio</otm:DomainName> <otm:Xid>#origen</otm:Xid> </otm:Gid> </otm:LocationGid> </otm:LocationRef> </otm:ShipFromLocationRef> <otm:ShipToLocationRef> <otm:LocationRef> <otm:LocationGid> <otm:Gid> <otm:DomainName>#dominio</otm:DomainName> <otm:Xid>#destino</otm:Xid> </otm:Gid> </otm:LocationGid> </otm:LocationRef> </otm:ShipToLocationRef> <otm:TimeWindow> <otm:EarlyPickupDt> <otm:GLogDate>#early</otm:GLogDate> <otm:TZId>America/Buenos_Aires</otm:TZId> <otm:TZOffset>-03:00</otm:TZOffset> </otm:EarlyPickupDt> <otm:LateDeliveryDt> <otm:GLogDate>#late</otm:GLogDate> <otm:TZId>America/Buenos_Aires</otm:TZId> <otm:TZOffset>-03:00</otm:TZOffset> </otm:LateDeliveryDt> </otm:TimeWindow> " 
var lineBase = "<otm:ReleaseLine> <otm:ReleaseLineGid> <otm:Gid> <otm:DomainName>#dominio</otm:DomainName> <otm:Xid>#xid</otm:Xid> </otm:Gid> </otm:ReleaseLineGid> <otm:PackagedItemRef> <otm:PackagedItemGid> <otm:Gid> <otm:DomainName>#dominio</otm:DomainName> <otm:Xid>#pi</otm:Xid> </otm:Gid> </otm:PackagedItemGid> </otm:PackagedItemRef> <otm:ItemQuantity> <otm:PackagedItemCount>#cantidad</otm:PackagedItemCount> </otm:ItemQuantity> <otm:TransportHandlingUnitRef> <otm:ShipUnitSpecRef> <otm:ShipUnitSpecGid> <otm:Gid> <otm:DomainName>#dominio</otm:DomainName> <otm:Xid>#thu</otm:Xid> </otm:Gid> </otm:ShipUnitSpecGid> </otm:ShipUnitSpecRef> </otm:TransportHandlingUnitRef> <otm:IsSplitAllowed>N</otm:IsSplitAllowed> </otm:ReleaseLine> "
var orFooter = "<otm:ReleaseTypeGid> <otm:Gid> <otm:DomainName>#dominio</otm:DomainName> <otm:Xid>#tipoorden</otm:Xid> </otm:Gid> </otm:ReleaseTypeGid> </otm:Release> </otm:GLogXMLElement> "
var XMLfooter = "</otm:TransmissionBody> </otm:Transmission> ";
//Fin de plantillas XML



//Creacion de ordenes
var Ordenes = [];

function crearLine(input,i,k){
    var line = lineBase;
    line = line.replace(/#xid/g,'#xid_'+k,"gi");
    line = line.replace(/#pi/g,input[i].PACKAGED_ITEM,"gi");
    line = line.replace(/#cantidad/g,input[i].QUANTITY,"gi");
    line = line.replace(/#thu/g,input[i].THU,"gi");
    return line;
}

function crearOrLines(input,xid){
    var resultado='';
    k=1;
    for(i=0;i<input.length;i++){
        if(xid==input[i].ORDER_XID){
            resultado = resultado + crearLine(input,i,k);
            k++;
        }
    }
    return resultado;
}

function crearOr(input,i){
    var lines= crearOrLines(input,input[i].ORDER_XID);
    var resultOr = '';
    resultOr = orHeader+lines+orFooter;
    var Vdominio = document.getElementById('dominio').value;
    resultOr = resultOr.replace(/#xid/g,input[i].ORDER_XID,"gi");
    resultOr = resultOr.replace(/#dominio/g,Vdominio,"gi"); 
    resultOr = resultOr.replace(/#itinerario/g,input[i].ITINERARY,"gi");
    if(input[i].hasOwnProperty('ITINERARY')){
        resultOr = resultOr.replace(/<!-- <otm:FixedItineraryGid>/g,'<otm:FixedItineraryGid>',"gi");     
        resultOr = resultOr.replace(/FixedItineraryGid> -->/g,'FixedItineraryGid>',"gi");
    }
    resultOr = resultOr.replace(/#origen/g,input[i].SOURCE,"gi");
    resultOr = resultOr.replace(/#tipoorden/g,input[i].ORDER_TYPE,"gi");
    resultOr = resultOr.replace(/#config/g,input[i].ORDER_CONFIG,"gi");
    resultOr = resultOr.replace(/#destino/g,input[i].DESTINATION,"gi");
    return resultOr;
}

function crearTodas(input){
    resultado = ''
    var j=0;
    while(j<input.length){
            resultado = resultado + crearOr(input,j);
            console.log(resultado);
            while((j+1<input.length) && input[j].ORDER_XID==input[j+1].ORDER_XID){
                if((input[j].ORDER_XID==input[j+1].ORDER_XID)){j++};
            }
            j++;
    }
    var Vearly = document.getElementById('early').value + ' ' + document.getElementById('earlytime').value;
    Vearly = convertirFechaHora(Vearly)+'00';
    var Vlate = document.getElementById('late').value + ' ' +document.getElementById('latetime').value;
    Vlate = convertirFechaHora(Vlate)+'00';
    resultado = resultado.replace(/#early/g,Vearly,"gi");
    resultado = resultado.replace(/#late/g,Vlate,"gi");
    return resultado;
}
//Fin de creacion de ordenes


    //Subida de Datos en Excel
    var selectedFile;
    let aux = [];
    document
        .getElementById("fileUpload")
        .addEventListener("change", function (event) {
            selectedFile = event.target.files[0];
        });
    document
        .getElementById("uploadExcel")
        .addEventListener("click", function () {
        if (selectedFile) {
            var fileReader = new FileReader();
            fileReader.onload = function (event) {
                var data = event.target.result;
                var workbook = XLSX.read(data, {
                    type: "binary"
                });
                workbook.SheetNames.forEach(sheet => {
                    var rowObject = XLSX.utils.sheet_to_row_object_array(
                        workbook.Sheets[sheet]
                    );
                    var jsonObject = JSON.stringify(rowObject);
                    document.getElementById("jsonData").innerHTML = jsonObject;
                    console.log(jsonObject);
                    aux.push(rowObject);
                    console.log(aux)
                });   
            };
            fileReader.readAsBinaryString(selectedFile);             
        }
        });
        var datos = aux[0];
    //Fin de subida de datos en Excel




//Ejecución
function run(){
    //CAPTURA DE DATOS GENERALES
        var Vnamefile = document.getElementById('filename').value;
    //FIN CAPTURA DE DATOS GENERALES



        
        //REVISANDO SI APLICA ITINERARIO
    //    if(Vitinerario!=''){
    //        orBase = orBase.replace('<!--','');
    //        orBase = orBase.replace('-->','');
    //    }
    
    
    //DESCARGA DE ARCHIVO
    var nombreArchivo = Vnamefile+'.XML';
    var contenido = XMLheader+crearTodas(aux[0])+XMLfooter;
    const blob = new Blob([contenido], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    //FIN DESCARGA DE ARCHIVO
    }
//Fin de Ejecucion


//Contenido XML
console.log(XMLheader+crearTodas(aux[0])+XMLfooter);
//Fin de contenido XML

