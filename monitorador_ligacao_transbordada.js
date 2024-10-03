// Noticação negativa
async function notificacao_negativa_lig(horario,numero){    
    Notification.requestPermission(/* opcional: callback */);
   var texto = `${horario} - Ligação não atendida. | ${numero}`
    var notification = new Notification("Checar", {
        icon: 'https://w7.pngwing.com/pngs/72/539/png-transparent-anger-disgust-emotion-pixar-sadness-intensamente-child-orange-film.png',
        body: texto
    });
    notification.onclick = function() {}
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


// Função para pegar o primeiro e o quarto TD de cada TR dentro do tbody com id="body_ligacoes"
function coletarLigacoes() {
    var numeros_ligando = [];    
    var tempo_fila = [];
    var nomes = [];
    var status = [];

    // Coleta o primeiro e o quarto TD de cada linha TR no tbody com id "body_ligacoes"
    $('#body_ligacoes tr').each(function() {
        // Adiciona o texto do primeiro TD (primeira célula da linha) ao array "numeros_ligando"
        var primeiroTD = $(this).find('td:nth-child(1)').text().trim();
        numeros_ligando.push(primeiroTD);        

        // Adiciona o texto do quarto TD (quarta célula da linha) ao array "tempo_fila"
        var segundoTD = $(this).find('td:nth-child(2)').text().trim();
        tempo_fila.push(segundoTD);

        // Adiciona o texto do quarto TD (quarta célula da linha) ao array "nomes"
        var terceiroTD = $(this).find('td:nth-child(3)').text().trim();
        nomes.push(terceiroTD);

        // Adiciona o texto do quarto TD (quarta célula da linha) ao array "status"
        var quartoTD = $(this).find('td:nth-child(4)').text().trim();
        status.push(quartoTD);
    });

    // Retorna um objeto com os arrays de números ligando e status dos números
    return { numeros_ligando: numeros_ligando, tempo_fila: tempo_fila, nomes:nomes, status:status };
}

// Função para monitorar mudanças no status a cada 5 segundos
function monitorarLigacoes() {   
    
    // Função que será chamada periodicamente
    setInterval(function() {
        var dados = coletarLigacoes(); // Coleta os números e status atuais
        
        var numeros_ligando = dados.numeros_ligando;
        var tempo_fila = dados.tempo_fila;                
        var nomes = dados.nomes;
        var status = dados.status;

        // Itera pelos status e compara com o status anterior
        for (var i = 0; i < numeros_ligando.length; i++) {                  
            if (status[i] === "Em fila" && tempo_fila[i] === "00:00:17" && nomes[i]==="") {
                console.log("%c"+obterHorarioBrasil() + " - Número: " + numeros_ligando[i] + " | PROVAVELMENTE TRANSBORDOU.", 'color: red');                
                notificacao_negativa_lig(obterHorarioBrasil(),numeros_ligando[i])                
            }        
            if (status[i] === "Em fila" && tempo_fila[i] === "00:00:18" && nomes[i]==="") {
                console.log("%c"+obterHorarioBrasil() + " - Número: " + numeros_ligando[i] + " | PROVAVELMENTE TRANSBORDOU.", 'color: red');                
                notificacao_negativa_lig(obterHorarioBrasil(),numeros_ligando[i])                
            }        
            if (status[i] === "Em fila" && tempo_fila[i] === "00:00:19" && nomes[i]==="") {
                console.log("%c"+obterHorarioBrasil() + " - Número: " + numeros_ligando[i] + " | PROVAVELMENTE TRANSBORDOU.", 'color: red');                
                notificacao_negativa_lig(obterHorarioBrasil(),numeros_ligando[i])                
            }               
            if (status[i] === "Em fila" && tempo_fila[i] === "00:00:20" && nomes[i]==="") {
                console.log("%c"+obterHorarioBrasil() + " - Número: " + numeros_ligando[i] + " | PROVAVELMENTE TRANSBORDOU.", 'color: red');                
                notificacao_negativa_lig(obterHorarioBrasil(),numeros_ligando[i])                
            }               
        }


    }, 1000); // Executa a cada 1s
}

// Inicia o monitoramento
monitorarLigacoes();
