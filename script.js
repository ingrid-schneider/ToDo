// ---------------------------------------------------------
// 1. VARIÁVEIS GLOBAIS
// ---------------------------------------------------------

// Procura pelo elemento com o ID "txt-nova-tarefa" no documento HTML
const txt_nova_tarefa = document.querySelector("#txt-nova-tarefa");
// Procura pelo elemento com o ID "btn-nova-tarefa" no documento HTML
const btn_nova_tarefa = document.querySelector("#btn-nova-tarefa");
// Procura pelo elemento com o ID "btn-nova-tarefa" no documento HTML
const lista_tarefas = document.querySelector("#lista-tarefas");


// Carrega o áudio reproduzido ao Concluir uma tarefa
const audioConcluir = new Audio('sound/gmae.wav');
// Força o navegador a carregar o áudio para evitar atrasos na reprodução
audioConcluir.preload = "auto";

// Variável global que controla a exibição da modal "Excluir tarefa"
const modalExcluir = new bootstrap.Modal(document.getElementById('exampleModal'));

// Variável global que armazena a tarefa que será excluída
let id_tarefa_excluir;

// ---------------------------------------------------------
// 2. FUNÇÕES DE LÓGICA
// ---------------------------------------------------------

function iniciaToDo() {
    //alert("olá mundo!")
    
    // Associa função ao evento de clicar no botão de "Adicionar" nova tarefa
    btn_nova_tarefa.addEventListener("click", adicionarTarefa);
    // Associa função "adicionarTarefaEnter()" ao evento de pressionar qualquer tecla 
    // no campo de "Adicionar nova tarefa"
    txt_nova_tarefa.addEventListener("keypress", adicionarTarefaEnter);

    const arrayTarefas = obterTarefasDoNavegador();
    salvarCookieTarefas([]);
    arrayTarefas.forEach(strTarefa => {
        adicionarTarefa(strTarefa);
    });

    lista_tarefas.querySelectorAll("li").forEach(li => makeDraggable(li));
}

function adicionarTarefa(strTarefa) {
    if (typeof strTarefa !== 'string' || strTarefa == null) {
        strTarefa = txt_nova_tarefa.value;
    }
    // Se a caixa de texto de "Adicionar nova tarefa" não está vazia
    // .trim() remove espaços em branco do começo e fim do calor do campo
    if (strTarefa.trim() !== "") {
        const btn_item = `
                <div>
                    <button class="btn btn-success btn-sm me-2 btn-concluir"onclick="concluirTarefa(this)">Concluir</button>
                    <button class="btn btn-danger btn-sm btn-excluir" onclick="obterIDTarefaExcluir(this);modalExcluir.show();">Excluir</button>
                </div>
    `;
        
        // Cria um novo item de lista
        const item = document.createElement("li");
        item.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        // Adiciona o texto digitado na caixa de texto e os botões para concluir e excluir a tarefa.
        // "span" permite aplicar formação em linha
        //"w-75" limita o nome da tarefa á 75% do tamanho da linha, deixando 25% do tamanho que excedem 75% do tamanho da linha
        // "text-truncate" corta e adiciona reticencias (tres pontos...) em nomes de tarefas que excedem 75% do tamanh da linha
        item.innerHTML = "<span class='w-75 text-truncate'>" + strTarefa + "</span>" + btn_item;
        
        makeDraggable(item);
        item.addEventListener("dragend", () => {
            let arrayTarefas = [];
            Array.from(lista_tarefas.children).forEach(i => {
                i.classList.remove('over')
                arrayTarefas.push(i.querySelector("span").textContent);
            });
            salvarCookieTarefas(arrayTarefas);
        });

        adicionarTarefaAoCookie(strTarefa);
        
        // Adicona o item a lista de tarefas
        lista_tarefas.append(item);
        
    }
    // Limpa o campo de texto de "Adicionar nova tarefa" após adicionar a tarefa a lista
    txt_nova_tarefa.value = "";
    // Seleciona o campo "Adicionar nova tarefa" após adicionar a tarefa a lista
    txt_nova_tarefa.focus();
}

function adicionarTarefaEnter(evento) {
    if (evento.key == "Enter") {
        // Chama a função JavaScript "AdicionarTarefa()"
        adicionarTarefa();
    }
}

function concluirTarefa(btn_concluir) {
    audioConcluir.play();
    
    // Jogar 100 confettis na tela
    for (let i = 0; i <= 100; i++) {
        confetti();
    }

    // Atualiza o ID da tarefa a ser excluída e passa como parametro o botão de "Concluir" clickado.
    obterIDTarefaExcluir(btn_concluir);

    // Chama a função JS "excluirTarefa()".
    excluirTarefa();
}  

function excluirTarefa() {
    const arrayTarefas = obterTarefasDoNavegador();
    arrayTarefas.splice(id_tarefa_excluir, 1);
    salvarCookieTarefas(arrayTarefas);
    // Remove o item da lista de tarefas
    lista_tarefas.removeChild(lista_tarefas.children[id_tarefa_excluir]);
    // Fecha modal de "Excluir tarefa"
    modalExcluir.hide();
}

function obterIDTarefaExcluir (btn) {
    // Encontra o elemento HTML "li" (item) pai mais próximo do
    // botão de "Concluir" ou "Excluir" clickado.
    // Perceba que a função JS "obterIDTarefaExcluir()", o botão clickado é
    // recebido como parametro da função (btn).
    const item = btn.closest("li");
    const tarefas = Array.from(lista_tarefas.children);
    id_tarefa_excluir = tarefas.indexOf(item);
    
}// ---------------------------------------------------------
// 3. COOKIE
// ---------------------------------------------------------

const CHAVE_TAREFAS_TODO = 'tarefas_todo';

function obterTarefasDoNavegador() {
    try {
        const cookie = localStorage.getItem(CHAVE_TAREFAS_TODO);
        if (cookie) {
            return JSON.parse(cookie);
        }
    } catch (e) {
        console.error("Falha ao ler o cookie do armazenamento local.");
    }
    return[];
}

function salvarCookieTarefas(arrayTarefas) {
    try {
        localStorage.setItem(CHAVE_TAREFAS_TODO, JSON.stringify(arrayTarefas));
    } catch (e) {
        console.error("ERRO: Falah ao salvar as tarefas no navegador. Error:", e);
    }
}

function adicionarTarefaAoCookie(strTarefa) {
    const arrayTarefas = obterTarefasDoNavegador();
    arrayTarefas.push(strTarefa);
    salvarCookieTarefas(arrayTarefas);
}

// ---------------------------------------------------------
// 4. ESCUTADORES DE EVENTOS E INÍCIO
// ---------------------------------------------------------

iniciaToDo();
