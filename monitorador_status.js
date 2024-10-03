
/// Comentários: Tudo ok nessa versão

function ordenar(nomes,status){
    // Combina os dois vetores em um vetor de objetos temporário
    let pessoas = nomes.map((nome, i) => ({ nome: nome, stat: status[i] }));

    // Ordena o vetor de objetos com base nos nomes
    pessoas.sort((a, b) => {
        if (a.nome < b.nome) return -1;
        if (a.nome > b.nome) return 1;
        return 0;
    });

    // Separa os dados de volta em dois vetores distintos
    var nomes = pessoas.map(pessoa => pessoa.nome);
    var status = pessoas.map(pessoa => pessoa.stat);
    
    return { nomes: nomes, status: status };
}



async function notificacao_negativa(nome, horario) {
    Notification.requestPermission(/* opcional: callback */);
    var texto = `${horario} - Ligação não atendida. | ${nome}`
    var notification = new Notification("Checar", {
        icon: 'https://w7.pngwing.com/pngs/72/539/png-transparent-anger-disgust-emotion-pixar-sadness-intensamente-child-orange-film.png',
        body: texto
    });
    notification.onclick = function () { }
}

async function notificacao_positiva(nome, horario) {
    Notification.requestPermission(/* opcional: callback */);
    var texto = `${horario} - Ligação atendida. | ${nome}`
    var notification = new Notification("Tudo ok", {
        icon: 'https://w7.pngwing.com/pngs/488/912/png-transparent-green-phone-symbol-green-phone-icon-telephone-symbol.png',
        body: texto
    });
    notification.onclick = function () { }
}

// Função para coletar nomes e status (a mesma de antes)
function coletarNomesStatus() {
    var nomes = [];
    var status = [];

    // Coleta o primeiro e o quarto TD de cada linha TR no tbody com id "body_ligacoes"
    $('#body_filas tr').each(function() {
        // Adiciona o texto do primeiro TD (primeira célula da linha) ao array "numeros_ligando"
        var primeiroTD = $(this).find('td:nth-child(2)').text().trim();
        nomes.push(primeiroTD);

        // Adiciona o texto do primeiro TD (primeira célula da linha) ao array "numeros_ligando"
        var terceiroTD = $(this).find('td:nth-child(3)').text().trim();
        status.push(terceiroTD);
        
    });

    // Retorna um objeto com os arrays nomes e status
    return { nomes: nomes, status: status };
}

// Função para obter o horário atual de Brasília (GMT-3)
function obterHorarioBrasil() {
    var dataAtual = new Date();

    // Ajusta o horário para o fuso horário de Brasília (GMT-3)
    var horarioBrasil = new Date(dataAtual.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));

    // Formata a hora para HH:MM:SS
    var horas = horarioBrasil.getHours().toString().padStart(2, '0');
    var minutos = horarioBrasil.getMinutes().toString().padStart(2, '0');
    var segundos = horarioBrasil.getSeconds().toString().padStart(2, '0');

    return horas + ":" + minutos + ":" + segundos;
}

// Função para monitorar mudanças no status a cada 0,1 segundos
function monitorarStatus() {
    var statusAnterior = []; // Armazena o status anterior

    // Função que será chamada periodicamente
    setInterval(function () {
        var dados = coletarNomesStatus(); // Coleta os nomes e status atuais
        var nomes = dados.nomes;
        var statusAtuais = dados.status;

        // ordenando o nome dos operadores
        dados = ordenar(nomes,statusAtuais)
        nomes = dados.nomes;
        statusAtuais = dados.status;

        // Se statusAnterior estiver vazio (primeira execução), inicializa com os status atuais
        if (statusAnterior.length === 0) {
            statusAnterior = [...statusAtuais];
        }                

        // Itera pelos status e compara com o status anterior
        for (var i = 0; i < statusAtuais.length; i++) {
            // Verifica se o status mudou de "Tocando" para "Ocupado"
            if (statusAnterior[i] === "Tocando" && statusAtuais[i] === "Ocupado") {
                notificacao_positiva(nomes[i], obterHorarioBrasil())
                console.log("%c" + obterHorarioBrasil() + " - O status de " + nomes[i] + " mudou de Tocando para Ocupado.", 'color: yellow');                
            }
            // Verifica se o status mudou de "Tocando" para algo diferente de "Ocupado"
            else if (statusAnterior[i] === "Tocando" && statusAtuais[i] !== "Tocando" && statusAtuais[i] !== "Ocupado") {
                notificacao_negativa(nomes[i], obterHorarioBrasil())
                console.log("%c CHECAR MOTIVO DE NÃO TER ATENDIDO::: " + obterHorarioBrasil() + " O status de " + nomes[i] + " mudou de Tocando para " + statusAtuais[i], 'color: red');                
                // alert("CHECAR MOTIVO DE NÃO TER ATENDIDO::: " + obterHorarioBrasil() + "O status de " + nomes[i] + " mudou de Tocando para " + statusAtuais[i])
            }
        }

        // Atualiza o status anterior para o próximo ciclo de monitoramento
        statusAnterior = [...statusAtuais];

    }, 1000); // Executa a cada 0,1 segundos (100 ms)
}

// Inicia o monitoramento
monitorarStatus();
