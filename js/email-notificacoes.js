// ============================================
// GOOGLE CALENDAR INTEGRATION
// ============================================

let tokenClient = null;
let gapiInitialized = false;

// Inicializar Google API
function initGoogleCalendar() {
    return new Promise((resolve, reject) => {
        try {
            // Verificar se a API do Google está carregada
            if (typeof google === 'undefined') {
                console.warn('⚠️ Google API não carregada. Tentando carregar...');
                
                // Carregar a API do Google dinamicamente
                const script = document.createElement('script');
                script.src = 'https://apis.google.com/js/api.js';
                script.onload = () => {
                    console.log('✅ Google API carregada!');
                    initGapiClient().then(resolve).catch(reject);
                };
                script.onerror = () => {
                    console.error('❌ Erro ao carregar Google API');
                    reject(new Error('Erro ao carregar Google API'));
                };
                document.head.appendChild(script);
            } else {
                initGapiClient().then(resolve).catch(reject);
            }
        } catch (error) {
            console.error('❌ Erro na inicialização do Google Calendar:', error);
            reject(error);
        }
    });
}

function initGapiClient() {
    return new Promise((resolve, reject) => {
        try {
            gapi.load('client', async () => {
                try {
                    await gapi.client.init({
                        apiKey: GOOGLE_API_KEY,
                        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
                    });
                    gapiInitialized = true;
                    console.log('✅ Google Calendar API inicializada!');
                    resolve();
                } catch (error) {
                    console.error('❌ Erro ao inicializar Google Calendar:', error);
                    reject(error);
                }
            });
        } catch (error) {
            console.error('❌ Erro ao carregar gapi:', error);
            reject(error);
        }
    });
}

// Inicializar Token Client
function initTokenClient() {
    return new Promise((resolve, reject) => {
        try {
            if (typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
                tokenClient = google.accounts.oauth2.initTokenClient({
                    client_id: GOOGLE_CLIENT_ID,
                    scope: 'https://www.googleapis.com/auth/calendar.events',
                    callback: (tokenResponse) => {
                        if (tokenResponse.error) {
                            console.error('❌ Erro de autenticação:', tokenResponse);
                            reject(new Error(tokenResponse.error));
                        } else {
                            console.log('✅ Token obtido com sucesso!');
                            resolve(tokenResponse);
                        }
                    },
                });
            } else {
                console.error('❌ Google Identity Services não carregado');
                reject(new Error('Google Identity Services não carregado'));
            }
        } catch (error) {
            console.error('❌ Erro ao inicializar Token Client:', error);
            reject(error);
        }
    });
}

// Função principal para processar agendamento
async function processarAgendamento(agendamento) {
    try {
        console.log('📅 Processando agendamento no Google Calendar...');
        console.log('📋 Dados:', agendamento);

        if (!agendamento || !agendamento.id) {
            console.error('❌ Agendamento inválido');
            return { sucesso: false, erro: 'Agendamento inválido' };
        }

        // Inicializar Google Calendar
        await initGoogleCalendar();

        // Inicializar Token Client e obter token
        await initTokenClient();

        // Solicitar token
        await new Promise((resolve, reject) => {
            if (!tokenClient) {
                reject(new Error('Token Client não inicializado'));
                return;
            }
            tokenClient.requestAccessToken({ prompt: '' });
            resolve();
        });

        // Criar evento no Google Calendar
        const event = await criarEventoCalendar(agendamento);
        
        console.log('✅ Evento criado no Google Calendar!');
        console.log('🔗 Link:', event.htmlLink);

        return { sucesso: true, evento: event };

    } catch (error) {
        console.error('❌ Erro ao processar agendamento:', error);
        return { sucesso: false, erro: error.message };
    }
}

// Função para criar evento no Google Calendar
async function criarEventoCalendar(agendamento) {
    try {
        if (!gapiInitialized) {
            throw new Error('Google Calendar API não inicializada');
        }

        // Preparar dados do evento
        const dataObj = new Date(`${agendamento.data}T${agendamento.horario}:00`);
        const dataFim = new Date(dataObj);
        dataFim.setHours(dataFim.getHours() + 1);

        const evento = {
            summary: `Levità - ${agendamento.servico}`,
            description: `
Cliente: ${agendamento.nome}
Telefone: ${agendamento.telefone}
E-mail: ${agendamento.email}
Serviço: ${agendamento.servico}
Tipo: ${agendamento.tipo === 'domicilio' ? 'Domiciliar' : 'Presencial'}
Endereço: ${agendamento.endereco}
            `.trim(),
            start: {
                dateTime: dataObj.toISOString(),
                timeZone: 'America/Sao_Paulo',
            },
            end: {
                dateTime: dataFim.toISOString(),
                timeZone: 'America/Sao_Paulo',
            },
            attendees: [
                { email: agendamento.email },
                { email: 'renatakemp@gmail.com' }
            ],
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 },
                    { method: 'popup', minutes: 30 },
                ],
            },
            colorId: '1',
        };

        console.log('📝 Criando evento:', evento);

        // Criar evento
        const response = await gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: evento,
            sendUpdates: 'all',
        });

        console.log('✅ Evento criado:', response);
        return response.result;

    } catch (error) {
        console.error('❌ Erro ao criar evento:', error);
        throw error;
    }
}

// Função para verificar se o usuário está autenticado
function isUserSignedIn() {
    try {
        if (gapi && gapi.client && gapi.client.getToken) {
            const token = gapi.client.getToken();
            return token !== null && token !== undefined;
        }
        return false;
    } catch (error) {
        console.error('❌ Erro ao verificar autenticação:', error);
        return false;
    }
}
