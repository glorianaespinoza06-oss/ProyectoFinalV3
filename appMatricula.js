import { supabase } from "./supebaseClient.js";

//========================
// DOM
//========================
const form = document.getElementById("estudiante-form");
const inputId = document.getElementById("idMatricula");
const inputCreditos = document.getElementById("creditos");
const inputIdEstudiante = document.getElementById("cmbEstudiantes").value;
const inputIdCarrera = document.getElementById("cmbCarreras").value;
const btnSave = document.getElementById("btn-save");
const btnCancel = document.getElementById("btn-cancel");
const statusDiv = document.getElementById("status");
let editando = false;
let listaMatriculas = document.getElementById("tablaMatriculas");
//========================
//Eventos
//========================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const creditos = inputCreditos.value.trim();
  const idCarrera = parseInt(document.getElementById("cmbCarreras").value);
  const idEstudiante = parseInt(
    document.getElementById("cmbEstudiantes").value
  );
  const idNivel = parseInt(document.getElementById("cmbNivelAcademico").value);
  const año = parseInt(document.getElementById("cmbAño").value);
  const periodo = parseInt(document.getElementById("cmbPeriodo").value);
  const idCurso = parseInt(document.getElementById("cmbCursos").value);
  if (editando) {
  } else {
    await crearMatricula(
      idEstudiante,
      idCarrera,
      creditos,
      idNivel,
      año,
      periodo,
      idCurso
    );
  }

  form.reset();
});

listaMatriculas.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-delete")) {
    const id = e.target.getAttribute("data-id");
    await eliminarMatriculas(id);
    cargarMatriculas();
  }
  if (e.target.classList.contains("btn-edit")) {
    const id = e.target.getAttribute("data-id");
    await editarMatriculas(id);
  }
});

document.getElementById("cmbCarreras").addEventListener("change", function () {
  cargarCursos(this.value);
});

document.getElementById("cmbCursos").addEventListener("change", function () {
  cargarCreditos(this.value);
});

//===================================
//CRUD (CREATE-READ-UPDATE-DELETE)
//===================================
async function cargarMatriculas() {
  let { data: Matriculas, error } = await supabase
    .from("Matriculas")
    .select("*");

  if (error) {
    console.error("Error al cargar estudiante:", error);
    return;
  }
  listaMatriculas.innerHTML = "";
  let tbody = document.getElementById("tablaMatriculas");
  tbody.innerHTML = ""; // limpiar antes de cargar

  for (let matricula of Matriculas) {
    let tr = document.createElement("tr");

    // AHORA SÍ funciona el await
    let carrera = await obtenerCarreraPorID(matricula.idCarrera);
    let estudiante = await obtenerEstudiantePorID(matricula.idEstudiante);
    let nivel = await obtenerNivelPorID(matricula.idNivel);
    let curso = await obtenerCursosPorID(matricula.idCurso);
    let periodo = await obtenerPeriodoPorID(matricula.periodo);
    let año = await obtenerAñosPorID(matricula.año);

    tr.innerHTML = `
            <td>${estudiante}</td>
            <td>${carrera}</td>
            <td>${curso}</td>
            <td>${matricula.creditos}</td>
            <td>${periodo}</td>
            <td>${año}</td>
            <td>
                <button class="btn btn-danger btn-sm btn-delete" data-id="${matricula.idMatricula}">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
            <td>
                <button class="btn btn-primary btn-sm btn-edit" data-id="${matricula.idMatricula}">
                  <i class="fa-solid fa-pencil"></i>
                </button>
            </td>
        `;

    tbody.appendChild(tr);
  }
}
async function crearMatricula(
  idEstudiante,
  idCarrera,
  creditos,
  idNivel,
  año,
  periodo,
  idCurso
) {
  const matricula = {
    idEstudiante,
    idCarrera,
    creditos,
    idNivel,
    año,
    periodo,
    idCurso,
  };
  let { error } = await supabase.from("Matriculas").insert([matricula]);
  if (error) {
    console.error("Error al crear una matricula:", error);
  }
  alert("✅ Matrícula creada correctamente.");
  cargarMatriculas();
}

async function eliminarMatriculas(idMatricula) {
  // Mostrar mensaje de confirmación
  const confirmar = confirm(
    "¿Está seguro de que desea eliminar esta matrícula?"
  );

  if (!confirmar) {
    return; // Si el usuario cancela, no se elimina
  }

  // Procede con el borrado
  let { error } = await supabase
    .from("Matriculas")
    .delete()
    .eq("idMatricula", idMatricula);

  if (error) {
    console.error("Error al eliminar la matrícula:", error);
    alert("❌ Ocurrió un error al eliminar la matrícula.");
  } else {
    alert("✅ Matrícula eliminada correctamente.");
  }
}

async function editarMatriculas(codigo) {
  let { data: matricula, error } = await supabase
    .from("Matriculas")
    .select("*")
    .eq("idMatricula", codigo)
    .single();

  if (error) {
    console.error(error);
  }
  // Cargar en HTML
  document.getElementById("creditos").value = matricula.creditos;
  document.getElementById("cmbCarreras").value = matricula.idCarrera;
  document.getElementById("cmbEstudiantes").value = matricula.idEstudiante;
  document.getElementById("cmbNivelAcademico").value = matricula.idNivel;
}

async function cargarCarreras() {
  let { data: carreras, error } = await supabase.from("Carreras").select("*");

  if (error) {
    console.error(error);
    return;
  }

  cargarCombo("cmbCarreras", carreras, "codigo", "descripcion");
}

async function cargarEstudiantes() {
  let { data: estudiantes, error } = await supabase
    .from("Estudiantes")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  cargarCombo("cmbEstudiantes", estudiantes, "idEstudiante", "nombre");
}

async function cargarAños() {
  let { data: niveles, error } = await supabase.from("Años").select("*");

  if (error) {
    console.error(error);
    return;
  }

  cargarCombo("cmbAño", niveles, "idAño", "descripcion");
}

async function cargarPeriodos() {
  let { data: niveles, error } = await supabase.from("Periodos").select("*");

  if (error) {
    console.error(error);
    return;
  }

  cargarCombo("cmbPeriodo", niveles, "idPeriodo", "descripcion");
}

async function cargarCursos(idCarrera) {
  let { data: niveles, error } = await supabase
    .from("Cursos")
    .select("*")
    .eq("idcarrera", idCarrera);

  if (error) {
    console.error(error);
    return;
  }

  cargarCombo("cmbCursos", niveles, "codigo", "nombre");
}

async function cargarCreditos(codigo) {
  let { data: carrera, error } = await supabase
    .from("Cursos")
    .select("*")
    .eq("codigo", codigo)
    .single();

  if (error) {
    console.error(error);
    return null;
  }
  document.getElementById("creditos").value = carrera.creditos;
  return carrera.creditos;
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
  lista.forEach((item) => {
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

async function obtenerEstudiantePorID(codigo) {
  let { data: estudiante, error } = await supabase
    .from("Estudiantes")
    .select("*")
    .eq("idEstudiante", codigo)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return estudiante.nombre;
}

async function obtenerCursosPorID(codigo) {
  let { data: curso, error } = await supabase
    .from("Cursos")
    .select("*")
    .eq("codigo", codigo)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return curso.nombre;
}

async function obtenerPeriodoPorID(codigo) {
  let { data: periodo, error } = await supabase
    .from("Periodos")
    .select("*")
    .eq("idPeriodo", codigo)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return periodo.descripcion;
}

async function obtenerAñosPorID(codigo) {
  let { data: año, error } = await supabase
    .from("Años")
    .select("*")
    .eq("idAño", codigo)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return año.descripcion;
}

cargarMatriculas();
cargarCarreras();
cargarEstudiantes();
cargarAños();
cargarPeriodos();
