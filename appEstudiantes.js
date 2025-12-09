import { supabase } from "./supebaseClient.js";

//========================
// DOM
//========================
const form = document.getElementById("estudiante-form");
const inputId = document.getElementById("idEstudiante");
const inputNombre= document.getElementById("nombre");
const inputCorreo = document.getElementById("correo");
const inputCelular= document.getElementById("celular");
const inputDireccion = document.getElementById("direccion");

const btnSave = document.getElementById("btn-save");
const btnCancel = document.getElementById("btn-cancel");
const statusDiv = document.getElementById("status");
let editando = false;
let listaEstudiantes = document.getElementById("tablaEstudiantes");
//========================
//Eventos
//========================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = inputNombre.value.trim();
  const correo = inputCorreo.value.trim();
  const celular = inputCelular.value.trim();
  const direccion = inputDireccion.value.trim();

  if (editando) {
  } else {
    await crearEstudiante(nombre, correo, celular, direccion);
  }

  form.reset();
});

listaEstudiantes.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-delete")) {
    const id = e.target.getAttribute("data-id");
    await eliminarEstudiante(id);
    cargarEstudiantes();
  }
    if (e.target.classList.contains("btn-edit")) {
    const id = e.target.getAttribute("data-id");
    await editarEstudiantes(id);
    cargarEstudiantes();
  }
});

//===================================
//CRUD (CREATE-READ-UPDATE-DELETE)
//===================================
async function cargarEstudiantes() {
  let { data: estudiantes, error } = await supabase
    .from("Estudiantes")
    .select("*");

  if (error) {
    console.error("Error al cargar estudiante:", error);
    return;
  }
  listaEstudiantes.innerHTML = "";
 let tbody = document.getElementById("tablaEstudiantes");
    tbody.innerHTML = ""; // limpiar antes de cargar

    for (let estudiante of estudiantes) {

        let tr = document.createElement("tr");

        // AHORA SÍ funciona el await
        tr.innerHTML = `
            <td>${estudiante.nombre}</td>
            <td>${estudiante.email}</td>
            <td>${estudiante.celular}</td>
            <td>${estudiante.direccion}</td>
            <td>
                <button class="btn btn-danger btn-sm btn-delete" data-id="${estudiante.idEstudiante}">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
            <td>
                <button class="btn btn-primary btn-sm btn-edit" data-id="${estudiante.idEstudiante}">
                  <i class="fa-solid fa-pencil"></i>
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    }
}
async function crearEstudiante(nombre, email, celular, direccion) {
  const estudiante = { nombre, email, celular, direccion };
  let { error } = await supabase.from("Estudiantes").insert([estudiante]);
  if (error) {
    console.error("Error al crear estudiante:", error);
  }
  alert("✅ Estudiante creado correctamente.");
  cargarEstudiantes();
}

async function eliminarEstudiante(idEstudiante) {
  // Mostrar mensaje de confirmación
  const confirmar = confirm("¿Está seguro de que desea eliminar este estudiante?");

  if (!confirmar) {
    return; // Si el usuario cancela, no se elimina
  }

  // Procede con el borrado
  let { error } = await supabase
    .from("Estudiantes")
    .delete()
    .eq("idEstudiante", idEstudiante);

  if (error) {
    console.error("Error al eliminar estudiante:", error);
    alert("❌ Ocurrió un error al eliminar el estudiante.");
  } else {
    alert("✅ Estudiante eliminado correctamente.");
  }
}

async function editarEstudiantes(codigo) {
let { data: estudiante, error } = await supabase
    .from("Estudiantes")
    .select("*")
    .eq("idEstudiante", codigo)
    .single();

  if (error) {
    console.error(error);
  }
   // Cargar en HTML
    document.getElementById("nombre").value = estudiante.nombre;
    document.getElementById("correo").value = estudiante.email;
    document.getElementById("celular").value = estudiante.celular;
    document.getElementById("direccion").value = estudiante.direccion;
}


cargarEstudiantes();

