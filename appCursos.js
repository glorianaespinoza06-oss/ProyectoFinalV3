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
  if (editando) {
  } else {
    await crearCurso(codigo, nombre, creditos);
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

    cursos.forEach((curso) => {
        let tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${curso.codigo}</td>
            <td>${curso.nombre}</td>
            <td>${curso.creditos}</td>
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
    });
}
async function crearCurso(codigo, nombre, creditos) {
  const curso = { codigo, nombre, creditos };
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
}

cargarCursos();
