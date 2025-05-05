class Usuarios {
  constructor(usuario, password, nroCuenta, saldo = 0) {
    this.usuario = usuario;
    this.password = password;
    this.cuenta = nroCuenta;
    this.saldo = saldo;
  }

  static generarNumeroCuenta(cuentas) {
    let cuenta;
    do {
      cuenta = Math.floor(1000 + Math.random() * 9000).toString(); // 9 cifras
    } while (cuentas.some(c => c.cuenta === cuenta));
    return cuenta;
  }
}

const form = document.getElementById("formRegistro");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;

  let cuentas = JSON.parse(localStorage.getItem("cuentas")) || [];


  const nroCuenta = Usuarios.generarNumeroCuenta(cuentas);


  const nuevaCuenta = new Usuarios(usuario, password, nroCuenta);


  cuentas.push(nuevaCuenta);
  localStorage.setItem("cuentas", JSON.stringify(cuentas));

  alert(`Cuenta creada correctamente.\nTu número de cuenta es: ${nroCuenta}`);
  window.location.href = "index.html";
});
