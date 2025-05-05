const tabla = document.getElementById("tablaCuentas");
let cuentas = JSON.parse(localStorage.getItem("cuentas")) || [];

function CargarTabla() {
  tabla.innerHTML = ""; 

  cuentas.forEach((cuenta, index) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${cuenta.usuario}</td>
      <td>${cuenta.cuenta}</td>
      <td>${cuenta.password}</td>
      <td><button onclick="EliminarCuenta(${index})">Eliminar</button></td>
    `;

    tabla.appendChild(fila);
  });
}

function EliminarCuenta(index) {
  if (confirm("¿Estás seguro de eliminar esta cuenta?")) {
    cuentas.splice(index, 1); 
    localStorage.setItem("cuentas", JSON.stringify(cuentas));
    CargarTabla(); 
  }
}

function Ingresar() {
  const usuario = document.getElementById("usuario").value;
  const nroCuenta = document.getElementById("cuenta").value;
  const password = document.getElementById("password").value;

  const cuentas = JSON.parse(localStorage.getItem("cuentas")) || [];

  const existe = cuentas.find(c => c.cuenta === nroCuenta && c.password === password && c.usuario === usuario);

  if (existe) {
    localStorage.setItem("cuentaLogueada", nroCuenta); 
    alert("Ingreso exitoso");
    window.location.href = "Principal.html";
  } else {
    alert("Número de cuenta o contraseña incorrectos");
  }
}



CargarTabla();