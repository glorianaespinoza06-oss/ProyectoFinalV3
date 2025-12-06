import { supabase } from "./supebaseClient.js";

//========================
// DOM
//========================
const form = document.getElementById("estudiante-form");
const inputId = document.getElementById("idEstudiante");
const inputNombre= document.getElementById("nombre");
const inputEmail = document.getElementById("email");
const inputIdCarrera = document.getElementById("cmbCarreras").value;
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
  const email = inputEmail.value.trim();
  const idCarrera = parseInt(document.getElementById("cmbCarreras").value);
  if (editando) {
  } else {
    await crearEstudiante(nombre, correo, idCarrera);
  }

  form.reset();
});

listaEstudiantes.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-delete")) {
    const id = e.target.getAttribute("data-id");
    await eliminarEstudiante(id);
    cargarEstudiante();
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
        let carrera = await obtenerCarreraPorID(estudiante.idCarrera);

        tr.innerHTML = `
            <td>${estudiante.nombre}</td>
            <td>${estudiante.email}</td>
            <td>${carrera}</td>
            <td>
                <button class="btn btn-danger btn-sm btn-delete" data-id="${estudiante.idEstudiante}">
                    Eliminar
                </button>
            </td>
            <td>
                <button class="btn btn-primary btn-sm btn-edit" data-id="${estudiante.idEstudiante}">
                    Editar
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    }
}
async function crearEstudiante(nombre, correo, idCarrera) {
  const estudiante = { nombre, correo, idCarrera };
  let { error } = await supabase.from("Estudiante").insert([estudiante]);
  if (error) {
    console.error("Error al crear estudiante:", error);
  }
  cargarEstudiante();
}

async function eliminarEstudiante(idEstudiante) {
  let { error } = await supabase
    .from("Estudiante")
    .delete()
    .eq("idEstudiante", idEstudiante);
  if (error) {
    console.error("Error al eliminar estudiante:", error);
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
    document.getElementById("email").value = estudiante.email;
    document.getElementById("idCarrera").value = estudiante.idCarrera;
}

async function cargarCarreras() {
    let { data: carreras, error } = await supabase
        .from("Carreras")
        .select("*");

    if (error) {
        console.error(error);
        return;
    }

    cargarCombo("cmbCarreras", carreras, "codigo", "descripcion");
}

function cargarCombo(comboId, lista, valueField, textField) {
    const combo = document.getElementById(comboId);
    combo.innerHTML = ""; // limpiar

    // Opción por defecto
    const opcionDefault = document.createElement("option");
    opcionDefault.textContent = "-- Seleccione --";
    opcionDefault.value = "";
    combo.appendChild(opcionDefault);

    // Recorrer la lista y agregar opciones
    lista.forEach(item => {
        const option = document.createElement("option");
        option.value = item[valueField];
        option.textContent = item[textField];
        combo.appendChild(option);
    });
}

async function obtenerCarreraPorID(codigo) {

let { data: carrera, error } = await supabase
    .from("Carreras")
    .select("*")
    .eq("codigo", codigo)
    .single();

    if (error) {
        console.error(error);
        return null;
    }

    return carrera.descripcion;
}

cargarEstudiantes();
cargarCarreras();
