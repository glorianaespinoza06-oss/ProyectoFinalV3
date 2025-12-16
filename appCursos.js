import { supabase } from "./supebaseClient.js";

//========================
// DOM
//========================
const form = document.getElementById("curso-form");
const inputCodigo = document.getElementById("codigo");
const inputNombre = document.getElementById("nombre");
const inputCreditos = document.getElementById("creditos");
const inputIdCarrera = document.getElementById("cmbCarreras");
const inputIdNivel = document.getElementById("cmbNivelAcademico");
const inputId = document.getElementById("id");
const btnSave = document.getElementById("btn-save");
const btnCancel = document.getElementById("btn-cancel");
const tituloForm = document.getElementById("form-title");
const listaCursos = document.getElementById("tablaCursos");

let editando = false;

//========================
// EVENTOS
//========================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const codigo = inputCodigo.value.trim();
  const nombre = inputNombre.value.trim();
  const creditos = parseInt(inputCreditos.value);
  const idcarrera = inputIdCarrera.value ? parseInt(inputIdCarrera.value) : null;
  const idNivel = inputIdNivel.value ? parseInt(inputIdNivel.value) : null;

  if (!idcarrera || !idNivel) {
    alert("Debe seleccionar carrera y nivel académico");
    return;
  }

  if (editando) {
    await actualizarCurso(codigo, nombre, creditos, idcarrera, idNivel);
    editando = false;
    tituloForm.textContent = "Registrar";
    btnSave.textContent = "Guardar";
    btnCancel.style.display = "none";
  } else {
    await crearCurso(codigo, nombre, creditos, idcarrera, idNivel);
  }

  form.reset();
});

listaCursos.addEventListener("click", async (e) => {
  const deleteBtn = e.target.closest(".btn-delete");
  const editBtn = e.target.closest(".btn-edit");

  if (deleteBtn) {
    const codigo = deleteBtn.dataset.id;
    await eliminarCurso(codigo);
    cargarCursos();
  }

  if (editBtn) {
    const codigo = editBtn.dataset.id;
    await editarCurso(codigo);
  }
});

btnCancel.addEventListener("click", () => {
  form.reset();
  editando = false;
  tituloForm.textContent = "Registrar";
  btnSave.textContent = "Guardar";
  btnCancel.style.display = "none";
});

//========================
// CRUD
//========================
async function cargarCursos() {
  const { data: cursos, error } = await supabase.from("Cursos").select("*");

  if (error) {
    console.error(error);
    return;
  }

  listaCursos.innerHTML = "";

  for (let curso of cursos) {
    const carrera = await obtenerCarreraPorID(curso.idcarrera);
    const nivel = curso.idNivel ? await obtenerNivelPorID(curso.idNivel) : "";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${curso.codigo}</td>
      <td>${curso.nombre}</td>
      <td>${curso.creditos}</td>
      <td>${carrera}</td>
      <td>${nivel}</td>
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

    listaCursos.appendChild(tr);
  }
}

async function crearCurso(codigo, nombre, creditos, idcarrera, idNivel) {
  const { error } = await supabase.from("Cursos").insert([
    { codigo, nombre, creditos, idcarrera, idNivel }
  ]);

  if (error) {
    console.error(error);
    alert("❌ Error al crear curso");
  } else {
    alert("✅ Curso creado correctamente");
    cargarCursos();
  }
}

async function actualizarCurso(codigo, nombre, creditos, idcarrera, idNivel) {
  const { error } = await supabase
    .from("Cursos")
    .update({ nombre, creditos, idcarrera, idNivel })
    .eq("codigo", codigo);

  if (error) {
    console.error(error);
    alert("❌ Error al actualizar curso");
  } else {
    alert("✅ Curso actualizado correctamente");
    cargarCursos();
  }
}

async function eliminarCurso(codigo) {
  if (!confirm("¿Desea eliminar este curso?")) return;

  const { error } = await supabase
    .from("Cursos")
    .delete()
    .eq("codigo", codigo);

  if (error) {
    console.error(error);
    alert("❌ Error al eliminar curso");
  }
}

async function editarCurso(codigo) {
  const { data: curso, error } = await supabase
    .from("Cursos")
    .select("*")
    .eq("codigo", codigo)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  inputCodigo.value = curso.codigo;
  inputNombre.value = curso.nombre;
  inputCreditos.value = curso.creditos;
  inputIdCarrera.value = curso.idcarrera;
  inputIdNivel.value = curso.idNivel;

  editando = true;
  tituloForm.textContent = "Editar curso";
  btnSave.textContent = "Actualizar";
  btnCancel.style.display = "inline-block";
}

//========================
// COMBOS
//========================
async function cargarCarreras() {
  const { data, error } = await supabase.from("Carreras").select("*");
  if (!error) cargarCombo("cmbCarreras", data, "codigo", "descripcion");
}

async function cargarNiveles() {
  const { data, error } = await supabase.from("NivelAcademico").select("*");
  if (!error) cargarCombo("cmbNivelAcademico", data, "idNivel", "descripcion");
}

function cargarCombo(id, lista, value, text) {
  const combo = document.getElementById(id);
  combo.innerHTML = '<option value="">-- Seleccione --</option>';

  lista.forEach(item => {
    const option = document.createElement("option");
    option.value = item[value];
    option.textContent = item[text];
    combo.appendChild(option);
  });
}

async function obtenerCarreraPorID(codigo) {
  const { data, error } = await supabase
    .from("Carreras")
    .select("descripcion")
    .eq("codigo", codigo)
    .single();

  if (error) {
    console.error(error);
    return "";
  }

  return data.descripcion;
}

async function obtenerNivelPorID(idNivel) {
  const { data, error } = await supabase
    .from("NivelAcademico")
    .select("descripcion")
    .eq("idNivel", idNivel)
    .single();

  if (error) {
    console.error(error);
    return "";
  }

  return data.descripcion;
}

//========================
// INIT
//========================
cargarCursos();
cargarCarreras();
cargarNiveles();