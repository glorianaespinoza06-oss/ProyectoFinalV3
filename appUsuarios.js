import { supabase } from "./supebaseClient.js";

//========================
// DOM
//========================      
const form = document.getElementById("formLogin");
const correoF = document.getElementById("email");
const contraseñaF = document.getElementById("password");

//========================
//Eventos
//========================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const correo = correoF.value.trim();
  const contraseña = contraseñaF.value.trim();

    let resultado = await validarLogin(correo, contraseña);

if (!resultado.ok) {
    mostrarMensaje("error", resultado.mensaje);
    return;
}

     mostrarMensaje("ok", "Bienvenido ");
  setTimeout(() => {
    window.location.href = "../Área_Principal.html";
}, 1500); // espera 1.5s

  form.reset();
});


async function validarLogin(correo, contrasena) {
  const { data: usuario, error } = await supabase
        .from("Usuarios")
        .select("*")
        .eq("correo", correo)
        .maybeSingle(); 
        // maybeSingle permite 0 o 1 registro sin error

    // Error al consultar Supabase
    if (error) {
        console.error("Error Supabase:", error.message);
        return {
            ok: false,
            mensaje: "Ocurrió un error al validar el usuario."
        };
    }

    // Si no encontró usuario (single lanza error, pero por si acaso)
    if (!usuario) {
        return {
            ok: false,
            mensaje: "Usuario no encontrado."
        };
    }

    // Validar contraseña (aquí asumo texto plano, tú puedes cambiar a hash)
    if (usuario.contraseña !== contrasena) {
        return {
            ok: false,
            mensaje: "Contraseña incorrecta."
        };
    }

    // Todo bien
    return {
        ok: true,
        mensaje: "Login correcto.",
        usuario: usuario
    };
}

function mostrarMensaje(tipo, texto) {
    const msg = document.getElementById("msgLogin");

    let clase = "";

    if (tipo === "error") clase = "alert alert-danger";
    if (tipo === "ok") clase = "alert alert-success";
    if (tipo === "info") clase = "alert alert-info";

    msg.innerHTML = `
        <div class="${clase}" role="alert">
            ${texto}
        </div>
    `;
}