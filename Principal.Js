class Cuenta {
  constructor(nroCuenta, saldo = 0) {
    this.nroCuenta = nroCuenta;
    this.saldo = saldo;
  }

  ingresarDinero(monto) {
    if (monto > 0) {
      this.saldo += monto;
      alert(`Ingresaste $${monto}. Tu nuevo saldo es $${this.saldo}`);
    } else {
      alert("El monto debe ser mayor que 0.");
    }
  }

  transferirDinero(nroDestino, monto) {
    const cuentas = JSON.parse(localStorage.getItem("cuentas")) || [];

    const indexOrigen = cuentas.findIndex(c => c.cuenta === this.nroCuenta);
    const indexDestino = cuentas.findIndex(c => c.cuenta === nroDestino);

    if (indexDestino === -1) {
      alert("La cuenta destino no existe.");
      return;
    }

    if (nroDestino === this.nroCuenta) {
      alert("No podés transferirte dinero a vos mismo.");
      return;
    }

    if (cuentas[indexOrigen].saldo < monto) {
      alert("Saldo insuficiente.");
      return;
    }

    cuentas[indexOrigen].saldo -= monto;
    cuentas[indexDestino].saldo += monto;

    this.saldo = cuentas[indexOrigen].saldo;

    localStorage.setItem("cuentas", JSON.stringify(cuentas));

    document.getElementById("saldo").textContent = "$" + this.saldo.toFixed(2);
    alert(`Transferiste $${monto} a la cuenta ${nroDestino}`);
  }
}

let miCuenta = null;

window.onload = () => {
  const nroCuenta = localStorage.getItem("cuentaLogueada");
  const cuentas = JSON.parse(localStorage.getItem("cuentas")) || [];

  const cuentaData = cuentas.find(c => c.cuenta === nroCuenta);

  if (cuentaData) {
   
    miCuenta = new Cuenta(cuentaData.cuenta, cuentaData.saldo);

    document.getElementById("nombreUsuario").textContent = cuentaData.usuario;
    document.getElementById("saldo").textContent = `$${miCuenta.saldo}`;
  } else {
    window.location.href = "index.html";
  }
};

function ingresarDinero() {
  const monto = parseFloat(prompt("¿Cuánto dinero querés ingresar?"));

  if (!isNaN(monto)) {
    miCuenta.ingresarDinero(monto);
    document.getElementById("saldo").textContent = "$" + miCuenta.saldo;


    const cuentas = JSON.parse(localStorage.getItem("cuentas")) || [];
    const index = cuentas.findIndex(c => c.cuenta === miCuenta.nroCuenta);
    if (index !== -1) {
      cuentas[index].saldo = miCuenta.saldo;
      localStorage.setItem("cuentas", JSON.stringify(cuentas));
    }
  } else {
    alert("Por favor ingresá un monto válido.");
  }
}

function transferirDinero() {
  const nroDestino = prompt("Ingresá el número de cuenta destino:");
  const monto = parseFloat(prompt("¿Cuánto querés transferir?"));

  if (!nroDestino || isNaN(monto) || monto <= 0) {
    alert("Datos inválidos.");
    return;
  }

  miCuenta.transferirDinero(nroDestino, monto);
}



