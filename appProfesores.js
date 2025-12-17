import { supabase } from "./supebaseClient.js";

//========================
// DOM
//========================
const form = document.getElementById("profesor-form");
const inputCodigo = document.getElementById("codigo");
const inputNombre = document.getElementById("nombre");
const inputCorreo = document.getElementById("correo");
const inputCelular = document.getElementById("celular");

const btnSave = document.getElementById("btn-save");
const btnCancel = document.getElementById("btn-cancel");
const statusDiv = document.getElementById("status");
const tituloForm = document.getElementById("form-title");
let editando = false;
let listaProfesores = document.getElementById("tablaProfesores");
//========================
//Eventos
//========================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const codigo = inputCodigo.value.trim();
  const nombre = inputNombre.value.trim();   
  const correo = inputCorreo.value.trim();
  const celular = inputCelular.value.trim();
  
  if (editando) {
    await actualizarProfesor(codigo, nombre, correo, celular);
     editando = false;
    tituloForm.textContent = "Registrar";
    btnSave.textContent = "Guardar";
    btnCancel.style.display = "none";
  } else {
   await crearProfesor(codigo, nombre, correo, celular);
  }

  form.reset();
});

listaProfesores.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-delete")) {
    const id = e.target.getAttribute("data-id");
    await eliminarProfesor(id);
    cargarProfesores();
  }

    if (e.target.classList.contains("btn-edit")) {
    const id = e.target.getAttribute("data-id");
    await editarProfesor(id);
    cargarProfesores();
  }


});

btnCancel.addEventListener("click", () => {
  form.reset();
  editando = false;
  tituloForm.textContent = "Registrar";
  btnSave.textContent = "Guardar";
  btnCancel.style.display = "none";
});


async function cargarProfesores() {
  let { data: profesores, error } = await supabase.from("Profesores").select("*");

  if (error) {
    console.error("Error al cargar profespres:", error);
    return;
  }
  listaProfesores.innerHTML = "";
let tbody = document.getElementById("tablaProfesores");
    tbody.innerHTML = ""; // limpiar antes de cargar

    profesores.forEach((profesor) => {
        let tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${profesor.codigo}</td>
            <td>${profesor.nombre}</td>
            <td>${profesor.correo}</td>
            <td>${profesor.celular}</td>
            <td>
                <button class="btn btn-danger btn-sm btn-delete" data-id="${profesor.codigo}">
                 <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
              <td>
                <button class="btn btn-primary btn-sm btn-edit" data-id="${profesor.codigo}">
                  <i class="fa-solid fa-pencil">  </i>
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

async function crearProfesor(codigo, nombre, correo, celular) {
  const profesor = { codigo, nombre, correo, celular };
  let { error } = await supabase.from("Profesores").insert([profesor]);
  if (error) {
    console.error(error);
  }
  alert("✅ Profesor creado correctamente.");
  cargarProfesores();
}

async function eliminarProfesor(codigo) {
  // Mostrar mensaje de confirmación
  const confirmar = confirm("¿Está seguro de que desea eliminar este profesor?");

  if (!confirmar) {
    return; // Si el usuario cancela, no se elimina
  }
  let { error } = await supabase.from("Profesores").delete().eq("codigo", codigo);
  if (error) {
    console.error("Error al eliminar un profesor:", error);
    alert("❌ Ocurrió un error al eliminar el profesor.");
  } else {
    alert("✅ Profesor eliminado correctamente.");
  }
}
async function editarProfesor(codigo) {
let { data: profesor, error } = await supabase
    .from("Profesores")
    .select("*")
    .eq("codigo", codigo)
    .single();

  if (error) {
    console.error(error);
  }
   // Cargar en HTML
    document.getElementById("codigo").value = profesor.codigo;
    document.getElementById("nombre").value = profesor.nombre;
    document.getElementById("correo").value = profesor.correo;
    document.getElementById("celular").value = profesor.celular;

     editando = true;
      tituloForm.textContent = "Editar profesor";
      btnSave.textContent = "Actualizar";
      btnCancel.style.display = "inline-block";
}

async function actualizarProfesor(codigo, nombre, correo, celular) {
   const { error } = await supabase
    .from("Profesores")
    .update({ nombre, correo, celular })
    .eq("codigo", codigo); 
  if (error) {
    console.error("Error al actualizar profesor:", error);
  }
  alert("✅ Profesor actualizado correctamente.");
  cargarProfesores();
}


cargarProfesores();
