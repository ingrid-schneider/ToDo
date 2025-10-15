// ---------------------------------------------------------
// 1. VARIÁVEIS GLOBAIS
// ---------------------------------------------------------

// Procura pelo elemento com o ID "txt-nova-tarefa" no documento HTML
const txt_nova_tarefa = document.querySelector("#txt-nova-tarefa");
// Procura pelo elemento com o ID "btn-nova-tarefa" no documento HTML
const btn_nova_tarefa = document.querySelector("#btn-nova-tarefa");
// Procura pelo elemento com o ID "btn-nova-tarefa" no documento HTML
const lista_tarefas = document.querySelector("#lista-tarefas");

// ---------------------------------------------------------
// 2. FUNÇÕES DE LÓGICA
// ---------------------------------------------------------

function iniciaToDo() {
    //alert("olá mundo!")

    // Associa função ao evento de clicar no botão de "Adicionar" nova tarefa
    btn_nova_tarefa.addEventListener("click", adicionarTarefa);
}

function adicionarTarefa() {
    alert("oi");
}
// ---------------------------------------------------------
// 3. ESCUTADORES DE EVENTOS E INÍCIO
// ---------------------------------------------------------

iniciaToDo();
