class Cuenta {
  constructor(nroCuenta, banco, saldo = 0) {
    this.nroCuenta = nroCuenta;
    this.banco = banco;
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

  transferirDinero(nroDestino, bancoDestino, monto) {
    const cuentas = JSON.parse(localStorage.getItem("cuentas")) || [];

    const indexOrigen = cuentas.findIndex(c => c.cuenta === this.nroCuenta && c.banco === this.banco);
    const indexDestino = cuentas.findIndex(c => c.cuenta === nroDestino && c.banco === bancoDestino);

    if (indexDestino === -1) {
      mostrarError("La cuenta destino no existe.");
      return false;
    }

    if (nroDestino === this.nroCuenta && bancoDestino === this.banco) {
      mostrarError("No podés transferirte dinero a vos mismo.");
      return false;
    }

    // Aplicar comisión si es transferencia interbancaria
    const comision = bancoDestino !== this.banco ? monto * 0.01 : 0;
    const totalDebitado = monto + comision;

    if (cuentas[indexOrigen].saldo < totalDebitado) {
      mostrarError(`Saldo insuficiente. Necesitas $${totalDebitado.toFixed(2)} (incluye $${comision.toFixed(2)} de comisión)`);
      return false;
    }

    cuentas[indexOrigen].saldo -= totalDebitado;
    cuentas[indexDestino].saldo += monto;

    this.saldo = cuentas[indexOrigen].saldo;

    localStorage.setItem("cuentas", JSON.stringify(cuentas));

    document.getElementById("saldo").textContent = "$" + this.saldo.toFixed(2);
    
    if (comision > 0) {
      mostrarExito(`Transferiste $${monto.toFixed(2)} a la cuenta ${nroDestino} (${bancoDestino}). Comisión: $${comision.toFixed(2)}`);
    } else {
      mostrarExito(`Transferiste $${monto.toFixed(2)} a la cuenta ${nroDestino}`);
    }
    
    return true;
  }
}

let miCuenta = null;

window.onload = () => {
  const nroCuenta = localStorage.getItem("cuentaLogueada");
  const banco = localStorage.getItem("bancoLogueado");
  const cuentas = JSON.parse(localStorage.getItem("cuentas")) || [];

  const cuentaData = cuentas.find(c => c.cuenta === nroCuenta && c.banco === banco);

  if (cuentaData) {
    miCuenta = new Cuenta(cuentaData.cuenta, cuentaData.banco, cuentaData.saldo);
    document.getElementById("nombreUsuario").textContent = cuentaData.usuario;
    document.getElementById("saldo").textContent = `$${miCuenta.saldo.toFixed(2)}`;
    document.getElementById("bancoActual").textContent = cuentaData.banco;
  } else {
    window.location.href = "index.html";
  }

  // Configurar el formulario de transferencia
  document.getElementById("formTransferencia").addEventListener("submit", function(e) {
    e.preventDefault();
    procesarTransferencia();
  });
};

function mostrarFormularioTransferencia() {
  document.getElementById("modalTransferencia").style.display = "block";
}

function cerrarModal() {
  document.getElementById("modalTransferencia").style.display = "none";
  document.getElementById("formTransferencia").reset();
}

function procesarTransferencia() {
  const bancoDestino = document.getElementById("bancoDestino").value;
  const cuentaDestino = document.getElementById("cuentaDestino").value;
  const monto = parseFloat(document.getElementById("montoTransferencia").value);

  if (!bancoDestino || !cuentaDestino || isNaN(monto) || monto <= 0) {
    mostrarError("Por favor complete todos los campos correctamente.");
    return;
  }

  const transferenciaExitosa = miCuenta.transferirDinero(cuentaDestino, bancoDestino, monto);
  
  if (transferenciaExitosa) {
    cerrarModal();
  }
}

function mostrarError(mensaje) {
  alert("Error: " + mensaje);
}

function mostrarExito(mensaje) {
  alert(mensaje); 
}

function ingresarDinero() {
  const monto = parseFloat(prompt("¿Cuánto dinero querés ingresar?"));

  if (!isNaN(monto)) {
    miCuenta.ingresarDinero(monto);
    document.getElementById("saldo").textContent = "$" + miCuenta.saldo.toFixed(2);

    const cuentas = JSON.parse(localStorage.getItem("cuentas")) || [];
    const index = cuentas.findIndex(c => c.cuenta === miCuenta.nroCuenta && c.banco === miCuenta.banco);
    if (index !== -1) {
      cuentas[index].saldo = miCuenta.saldo;
      localStorage.setItem("cuentas", JSON.stringify(cuentas));
    }
  } else {
    alert("Por favor ingresá un monto válido.");
  }
}

function eliminarCuenta() {
  if (confirm("¿Estás seguro de eliminar esta cuenta? Esta acción no se puede deshacer.")) {
    const cuentas = JSON.parse(localStorage.getItem("cuentas")) || [];
    const nuevaLista = cuentas.filter(c => !(c.cuenta === miCuenta.nroCuenta && c.banco === miCuenta.banco));
    
    localStorage.setItem("cuentas", JSON.stringify(nuevaLista));
    localStorage.removeItem("cuentaLogueada");
    localStorage.removeItem("bancoLogueado");
    
    alert("Cuenta eliminada correctamente.");
    window.location.href = "index.html";
  }
}