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
  cargarProfesores();
}

async function eliminarProfesor(codigo) {
  let { error } = await supabase.from("Profesores").delete().eq("codigo", codigo);
  if (error) {
    console.error(error);
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
}

cargarProfesores();
