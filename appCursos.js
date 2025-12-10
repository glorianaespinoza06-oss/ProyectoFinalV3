import { supabase } from "./supebaseClient.js";

//========================
// DOM
//========================
const form = document.getElementById("curso-form");
const inputCodigo = document.getElementById("codigo");
const inputNombre = document.getElementById("nombre");
const inputCreditos = document.getElementById("creditos");
const btnSave = document.getElementById("btn-save");
const btnCancel = document.getElementById("btn-cancel");
const statusDiv = document.getElementById("status");
let editando = false;
let listaCursos = document.getElementById("tablaCursos");
//========================
//Eventos
//========================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const codigo = inputCodigo.value.trim();
  const nombre = inputNombre.value.trim();
  const creditos = parseInt(inputCreditos.value.trim());
  const idcarrera = parseInt(document.getElementById("cmbCarreras").value);
  if (editando) {
  } else {
    await crearCurso(codigo, nombre, creditos,idcarrera);
  }

  form.reset();
});

listaCursos.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-delete")) {
    const id = e.target.getAttribute("data-id");
    await eliminarCursos(id);
    cargarCursos();
  }
    if (e.target.classList.contains("btn-edit")) {
    const id = e.target.getAttribute("data-id");
    await editarCursos(id);
    cargarCursos();
  }
});

//===================================
//CRUD (CREATE-READ-UPDATE-DELETE)
//===================================
async function cargarCursos() {
  let { data: cursos, error } = await supabase.from("Cursos").select("*");

  if (error) {
    console.error("Error al cargar cursos:", error);
    return;
  }
  listaCursos.innerHTML = "";
 let tbody = document.getElementById("tablaCursos");
    tbody.innerHTML = ""; // limpiar antes de cargar

      for (let curso of cursos) {

       let carrera = await obtenerCarreraPorID(curso.idcarrera);
        let tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${curso.codigo}</td>
            <td>${curso.nombre}</td>
            <td>${curso.creditos}</td>
             <td>${carrera}</td>
            <td>
                <button class="btn btn-danger btn-sm btn-delete" data-id="${curso.codigo}">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
             <td>
                <button class="btn btn-primary btn-sm btn-edit" data-id="${curso.codigo}">
                  <i class="fa-solid fa-pencil"></i>
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    }
}
async function crearCurso(codigo, nombre, creditos,idcarrera) {
  const curso = { codigo, nombre, creditos, idcarrera };
  let { error } = await supabase.from("Cursos").insert([curso]);
  if (error) {
    console.error(error);
  }
  alert("✅ Curso creado correctamente.");
  cargarCursos();
}

async function eliminarCursos(codigo) {
   // Mostrar mensaje de confirmación
  const confirmar = confirm("¿Está seguro de que desea eliminar este curso?");

  if (!confirmar) {
    return; // Si el usuario cancela, no se elimina
  }
  let { error } = await supabase.from("Cursos").delete().eq("codigo", codigo);
  if (error) {
    console.error("Error al eliminar curso:", error);
    alert("❌ Ocurrió un error al eliminar un curso.");
  } else {
    alert("✅ Curso eliminado correctamente.");
  }
}

async function editarCursos(codigo) {
let { data: curso, error } = await supabase
    .from("Cursos")
    .select("*")
    .eq("codigo", codigo)
    .single();

  if (error) {
    console.error(error);
  }
   // Cargar en HTML
    document.getElementById("codigo").value = curso.codigo;
    document.getElementById("nombre").value = curso.nombre;
    document.getElementById("creditos").value = curso.creditos;
    document.getElementById("cmbCarreras").value = curso.idcarrera;
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

cargarCursos();
cargarCarreras();