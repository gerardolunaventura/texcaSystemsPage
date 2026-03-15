function generarRecibo(nombre,monto,concepto){

const ventana=window.open("","","width=400,height=600");

ventana.document.write(`

<h2>Recibo comunidad</h2>

<p>Nombre: ${nombre}</p>

<p>Concepto: ${concepto}</p>

<p>Monto: $${monto}</p>

<p>Fecha: ${new Date().toLocaleDateString()}</p>

`);

ventana.print();

}