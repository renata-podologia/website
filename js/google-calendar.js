// ============================================
// GOOGLE CALENDAR API - INTEGRAÇÃO
// ============================================

// ============================================
// CARREGAR CONFIGURAÇÕES DOS SECRETS
// ============================================

// Tenta carregar do arquivo config.js (gerado pelo GitHub Actions)
let CLIENT_ID = '';
let CLIENT_SECRET = '';

try {
    if (typeof CONFIG !== 'undefined') {
        CLIENT_ID = CONFIG.GOOGLE_CLIENT_ID || '';
        CLIENT_SECRET = CONFIG.GOOGLE_CLIENT_SECRET || '';
        console.log('✅ Configuração carregada do GitHub Secrets!');
    } else {
        console.warn('⚠️ Arquivo config.js não encontrado. Usando fallback.');
        CLIENT_ID = 'SEU_CLIENT_ID_AQUI';
        CLIENT_SECRET = 'SUA_CLIENT_SECRET_AQUI';
    }
} catch(e) {
    console.warn('⚠️ Erro ao carregar configuração:', e);
    CLIENT_ID = 'SEU_CLIENT_ID_AQUI';
    CLIENT_SECRET = 'SUA_CLIENT_SECRET_AQUI';
}

// ============================================
// CONFIGURAÇÃO DO GOOGLE CALENDAR
// ============================================

const CALENDAR_CONFIG = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    scope: 'https://www.googleapis.com/auth/calendar.events',
    calendarId: 'primary'
};

console.log('📅 Google Calendar Client ID:', CLIENT_ID ? (CLIENT_ID === 'SEU_CLIENT_ID_AQUI' ? '⚠️ NÃO CONFIGURADO' : '✅ Configurado') : '❌ NÃO CONFIGURADO');

// ============================================
// CARREGAR A BIBLIOTECA DO GOOGLE
// ============================================
function carregarGoogleAPI() {
    return new Promise(function(resolve, reject) {
        if (typeof gapi !== 'undefined' && gapi.client) {
            console.log('✅ Google API já carregada!');
            resolve();
            return;
        }
        
        var script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = function() {
            console.log('✅ Google API carregada!');
            resolve();
        };
        script.onerror = function() {
            reject('❌ Erro ao carregar Google API');
        };
        document.head.appendChild(script);
    });
}

// ============================================
// INICIALIZAR O CLIENTE
// ============================================
function initGoogleClient() {
    return new Promise(function(resolve, reject) {
        if (typeof gapi === 'undefined') {
            reject('❌ Google API não carregada');
            return;
        }
        
        gapi.load('client:auth2', function() {
            gapi.client.init({
                apiKey: '',
                clientId: CALENDAR_CONFIG.clientId,
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
                scope: CALENDAR_CONFIG.scope
            }).then(function() {
                console.log('✅ Google Calendar inicializado!');
                resolve();
            }).catch(function(error) {
                console.error('❌ Erro ao inicializar:', error);
                reject(error);
            });
        });
    });
}

// ============================================
// VERIFICAR SE ESTÁ LOGADO
// ============================================
function isLogado() {
    try {
        var auth = gapi.auth2.getAuthInstance();
        return auth && auth.isSignedIn.get();
    } catch (e) {
        return false;
    }
}

// ============================================
// LOGIN NO GOOGLE
// ============================================
function loginGoogle() {
    return new Promise(function(resolve, reject) {
        try {
            var auth = gapi.auth2.getAuthInstance();
            auth.signIn({
                prompt: 'consent'
            }).then(function() {
                console.log('✅ Login realizado com sucesso!');
                resolve(true);
            }).catch(function(error) {
                console.error('❌ Erro ao fazer login:', error);
                reject(error);
            });
        } catch (error) {
            console.error('❌ Erro ao fazer login:', error);
            reject(error);
        }
    });
}

// ============================================
// CALCULAR HORA DE FIM (1 hora depois)
// ============================================
function calcularHoraFim(horario) {
    var partes = horario.split(':');
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
async function criarEventoCalendar(dados) {
    try {
        console.log('📅 Criando evento no Google Calendar...');
        console.log('👤 Paciente:', dados.nome);
        console.log('📅 Data:', dados.data);
        console.log('⏰ Horário:', dados.horario);
        console.log('📧 E-mail:', dados.email);
        
        if (!CALENDAR_CONFIG.clientId || CALENDAR_CONFIG.clientId === 'SEU_CLIENT_ID_AQUI') {
            console.error('❌ Google Calendar não configurado!');
            console.error('⚠️ Configure os secrets no GitHub:');
            console.error('   GOOGLE_CLIENT_ID');
            console.error('   GOOGLE_CLIENT_SECRET');
            return null;
        }
        
        var dataObj = new Date(dados.data + 'T00:00:00');
        var dataFormatada = dataObj.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        var dataHoraInicio = dados.data + 'T' + dados.horario + ':00-03:00';
        var dataHoraFim = dados.data + 'T' + calcularHoraFim(dados.horario) + ':00-03:00';
        
        var tipoLabel = dados.tipo === 'domicilio' ? '🏠 Domiciliar' : '🏢 Presencial';
        
        if (!isLogado()) {
            console.log('🔑 Usuário não logado. Solicitando login...');
            try {
                await loginGoogle();
            } catch (error) {
                console.error('❌ Erro ao fazer login:', error);
                return null;
            }
        }
        
        var evento = {
            'summary': dados.servico + ' - ' + dados.nome,
            'location': dados.endereco || 'Clínica - Guarulhos',
            'description': '\n🔔 NOVO AGENDAMENTO\n\n👤 Paciente: ' + dados.nome + '\n📱 Telefone: ' + dados.telefone + '\n📧 E-mail: ' + dados.email + '\n📋 Serviço: ' + dados.servico + '\n📍 Tipo: ' + tipoLabel + '\n🏠 Endereço: ' + (dados.endereco || 'Presencial - Clínica') + '\n📌 Status: Pendente\n🔑 Protocolo: #' + String(dados.id).padStart(5, '0') + '\n\n🔗 Ver no painel: https://renata-podologia.github.io/website/admin.html',
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
        
        var request = gapi.client.calendar.events.insert({
            'calendarId': CALENDAR_CONFIG.calendarId,
            'resource': evento
        });
        
        var response = await request.execute();
        
        if (response.error) {
            console.error('❌ Erro ao criar evento:', response.error);
            return null;
        }
        
        console.log('✅ Evento criado com sucesso!');
        console.log('🔗 Link do evento:', response.htmlLink);
        console.log('📧 Convite enviado para:', dados.email);
        console.log('📧 Convite enviado para: contato@levitapodologia.com.br');
        
        return response;
        
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
        
        if (!CALENDAR_CONFIG.clientId || CALENDAR_CONFIG.clientId === 'SEU_CLIENT_ID_AQUI') {
            console.error('❌ Google Calendar não configurado!');
            console.error('⚠️ Configure os secrets no GitHub:');
            console.error('   GOOGLE_CLIENT_ID');
            console.error('   GOOGLE_CLIENT_SECRET');
            return {
                sucesso: false,
                mensagem: 'Google Calendar não configurado. Configure os secrets no GitHub.'
            };
        }
        
        await carregarGoogleAPI();
        await initGoogleClient();
        var evento = await criarEventoCalendar(dados);
        
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

console.log('✅ Google Calendar integrado!');