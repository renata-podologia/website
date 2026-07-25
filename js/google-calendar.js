// ============================================
// GOOGLE CALENDAR API - NOVA VERSÃO (GIS)
// ============================================

// ============================================
// CARREGAR CONFIGURAÇÕES DOS SECRETS
// ============================================

// Tenta carregar do arquivo config.js
let CLIENT_ID = '';

try {
    if (typeof CONFIG !== 'undefined') {
        CLIENT_ID = CONFIG.GOOGLE_CLIENT_ID || '';
        console.log('✅ Configuração carregada do GitHub Secrets!');
    } else {
        console.warn('⚠️ Arquivo config.js não encontrado.');
        CLIENT_ID = '852872185034-k70n79v6pusp0jasp1jfcch4t1q2j40i.apps.googleusercontent.com';
    }
} catch(e) {
    console.warn('⚠️ Erro ao carregar configuração:', e);
    CLIENT_ID = '852872185034-k70n79v6pusp0jasp1jfcch4t1q2j40i.apps.googleusercontent.com';
}

console.log('📅 Google Calendar Client ID:', CLIENT_ID ? '✅ Configurado' : '❌ NÃO CONFIGURADO');

// ============================================
// CARREGAR A NOVA BIBLIOTECA DO GOOGLE (GIS)
// ============================================
function carregarGoogleAPI() {
    return new Promise(function(resolve, reject) {
        if (typeof google !== 'undefined' && google.accounts) {
            console.log('✅ Google Identity Services já carregado!');
            resolve();
            return;
        }
        
        var script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = function() {
            console.log('✅ Google Identity Services carregado!');
            resolve();
        };
        script.onerror = function() {
            reject('❌ Erro ao carregar Google Identity Services');
        };
        document.head.appendChild(script);
    });
}

// ============================================
// OBTER TOKEN DE ACESSO
// ============================================
function getAccessToken() {
    return new Promise(function(resolve, reject) {
        if (typeof google === 'undefined' || typeof google.accounts === 'undefined') {
            reject('❌ Google Identity Services não carregado');
            return;
        }
        
        var tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/calendar.events',
            callback: function(tokenResponse) {
                if (tokenResponse.error) {
                    console.error('❌ Erro ao obter token:', tokenResponse);
                    reject(tokenResponse);
                    return;
                }
                console.log('✅ Token obtido com sucesso!');
                resolve(tokenResponse.access_token);
            }
        });
        
        tokenClient.requestAccessToken();
    });
}

// ============================================
// CALCULAR HORA DE FIM (1 hora depois)
// ============================================
function calcularHoraFim(horario) {
    // Remove segundos se houver
    var horarioLimpo = horario;
    if (horarioLimpo.length > 5) {
        horarioLimpo = horarioLimpo.substring(0, 5);
    }
    
    var partes = horarioLimpo.split(':');
    var hora = parseInt(partes[0]);
    var minuto = parseInt(partes[1]);
    
    hora = hora + 1;
    
    if (hora >= 24) {
        hora = hora - 24;
    }
    
    return String(hora).padStart(2, '0') + ':' + String(minuto).padStart(2, '0');
}

// ============================================
// CRIAR EVENTO NO GOOGLE CALENDAR
// ============================================
async function criarEventoCalendar(dados, accessToken) {
    try {
        console.log('📅 Criando evento no Google Calendar...');
        console.log('👤 Paciente:', dados.nome);
        console.log('📅 Data:', dados.data);
        console.log('⏰ Horário:', dados.horario);
        console.log('📧 E-mail:', dados.email);
        
        // Limpa o horário (remove segundos)
        var horarioLimpo = dados.horario;
        if (horarioLimpo.length > 5) {
            horarioLimpo = horarioLimpo.substring(0, 5);
        }
        
        // Constrói as datas no formato ISO
        var dataHoraInicio = dados.data + 'T' + horarioLimpo + ':00-03:00';
        var horaFim = calcularHoraFim(horarioLimpo);
        var dataHoraFim = dados.data + 'T' + horaFim + ':00-03:00';
        
        console.log('📅 Início:', dataHoraInicio);
        console.log('📅 Fim:', dataHoraFim);
        
        var tipoLabel = dados.tipo === 'domicilio' ? '🏠 Domiciliar' : '🏢 Presencial';
        
        var evento = {
            'summary': dados.servico + ' - ' + dados.nome,
            'location': dados.endereco || 'Clínica - Guarulhos',
            'description': '🔔 NOVO AGENDAMENTO\n\n👤 Paciente: ' + dados.nome + '\n📱 Telefone: ' + dados.telefone + '\n📧 E-mail: ' + dados.email + '\n📋 Serviço: ' + dados.servico + '\n📍 Tipo: ' + tipoLabel + '\n🏠 Endereço: ' + (dados.endereco || 'Presencial - Clínica') + '\n📌 Status: Pendente\n🔑 Protocolo: #' + String(dados.id).padStart(5, '0'),
            'start': {
                'dateTime': dataHoraInicio,
                'timeZone': 'America/Sao_Paulo'
            },
            'end': {
                'dateTime': dataHoraFim,
                'timeZone': 'America/Sao_Paulo'
            },
            'attendees': [
                {'email': dados.email},
                {'email': 'contato@levitapodologia.com.br'}
            ],
            'reminders': {
                'useDefault': false,
                'overrides': [
                    {'method': 'email', 'minutes': 24 * 60},
                    {'method': 'popup', 'minutes': 30}
                ]
            }
        };
        
        console.log('📤 Enviando evento:', JSON.stringify(evento, null, 2));
        
        // Faz a requisição para a API do Google Calendar
        var response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(evento)
        });
        
        var data = await response.json();
        
        if (response.ok) {
            console.log('✅ Evento criado com sucesso!');
            console.log('🔗 Link do evento:', data.htmlLink);
            return data;
        } else {
            console.error('❌ Erro ao criar evento:', data);
            console.error('❌ Detalhes do erro:', data.error);
            return null;
        }
        
    } catch (error) {
        console.error('❌ Erro ao criar evento:', error);
        return null;
    }
}

// ============================================
// FUNÇÃO PRINCIPAL - PROCESSAR AGENDAMENTO
// ============================================
async function processarAgendamento(dados) {
    try {
        console.log('📅 Processando agendamento no Google Calendar...');
        
        if (!CLIENT_ID || CLIENT_ID === '') {
            console.error('❌ Google Calendar não configurado!');
            return {
                sucesso: false,
                mensagem: 'Google Calendar não configurado.'
            };
        }
        
        // 1. Carregar a nova API
        await carregarGoogleAPI();
        
        // 2. Obter token de acesso
        var accessToken = await getAccessToken();
        
        // 3. Criar evento no Google Calendar
        var evento = await criarEventoCalendar(dados, accessToken);
        
        if (evento) {
            return {
                sucesso: true,
                evento: evento,
                mensagem: 'Evento criado no Google Calendar!'
            };
        } else {
            return {
                sucesso: false,
                mensagem: 'Erro ao criar evento no Google Calendar.'
            };
        }
        
    } catch (error) {
        console.error('❌ Erro ao processar agendamento:', error);
        return {
            sucesso: false,
            error: error.message,
            mensagem: 'Erro ao processar agendamento: ' + error.message
        };
    }
}

// ============================================
// EXPORTA AS FUNÇÕES
// ============================================
window.processarAgendamento = processarAgendamento;
window.criarEventoCalendar = criarEventoCalendar;

console.log('✅ Google Calendar integrado (GIS)!');
