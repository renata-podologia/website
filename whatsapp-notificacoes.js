// ============================================
// SISTEMA DE NOTIFICAÇÕES VIA WHATSAPP
// ============================================

// CONFIGURAÇÕES
const WHATSAPP_CONFIG = {
    // Número da Renata (com DDD e país)
    numeroRenata: '5511978303833',
    
    // URL da API (usando a API gratuita do WhatsApp)
    // Opções: WATI, 360dialog, ou a própria Meta API
    apiUrl: 'https://api.wati.io/v1/api/...',
    
    // Token da API
    apiToken: 'seu_token_aqui'
};

// ============================================
// ENVIAR MENSAGEM PARA O CLIENTE
// ============================================
function enviarWhatsAppCliente(dados) {
    // Formata a data
    const dataObj = new Date(dados.data + 'T00:00:00');
    const dataFormatada = dataObj.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const tipoLabel = dados.tipo === 'domicilio' ? '🏠 Domiciliar' : '🏢 Presencial';
    
    // Mensagem para o cliente
    const mensagem = `
*✅ Agendamento Confirmado - Levità Podologia*

Olá *${dados.nome}*, seu agendamento foi realizado com sucesso! 🎉

📋 *Serviço:* ${dados.servico}
📅 *Data:* ${dataFormatada}
⏰ *Horário:* ${dados.horario}
📍 *Tipo:* ${tipoLabel}
🏠 *Endereço:* ${dados.endereco || 'Presencial - Clínica'}
🔑 *Protocolo:* #${String(dados.id).padStart(5, '0')}

📌 *Próximos passos:*
• Anote a data e horário
• Em caso de imprevistos, entre em contato
• Aguarde nossa confirmação por WhatsApp

📱 *Dúvidas?* Fale conosco: wa.me/${WHATSAPP_CONFIG.numeroRenata}

Agradecemos pela confiança! 🙏

*Levità Podologia - Podóloga Renata Kemp*
`;
    
    return mensagem;
}

// ============================================
// ENVIAR MENSAGEM PARA A RENATA
// ============================================
function enviarWhatsAppRenata(dados) {
    const dataObj = new Date(dados.data + 'T00:00:00');
    const dataFormatada = dataObj.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const tipoLabel = dados.tipo === 'domicilio' ? '🏠 Domiciliar' : '🏢 Presencial';
    
    // Mensagem para a Renata
    const mensagem = `
🔔 *NOVO AGENDAMENTO!*

👤 *Paciente:* ${dados.nome}
📱 *Telefone:* ${dados.telefone}
📋 *Serviço:* ${dados.servico}
📅 *Data:* ${dataFormatada}
⏰ *Horário:* ${dados.horario}
📍 *Tipo:* ${tipoLabel}
🏠 *Endereço:* ${dados.endereco || 'Presencial - Clínica'}
📌 *Status:* Pendente
🔑 *Protocolo:* #${String(dados.id).padStart(5, '0')}

📌 *Ações recomendadas:*
✅ Confirmar o agendamento
📱 Entrar em contato com o paciente
📝 Verificar o endereço (se for domicílio)

🔗 *Ver no painel:* https://renata-podologia.github.io/website/admin.html
`;
    
    return mensagem;
}

// ============================================
// FUNÇÃO PRINCIPAL - ENVIAR NOTIFICAÇÕES
// ============================================
async function enviarNotificacoesWhatsApp(dados) {
    try {
        console.log('📱 Enviando notificações via WhatsApp...');
        
        // Mensagens
        const msgCliente = enviarWhatsAppCliente(dados);
        const msgRenata = enviarWhatsAppRenata(dados);
        
        // Números (removendo caracteres especiais)
        const numeroCliente = dados.telefone.replace(/\D/g, '');
        const numeroRenata = WHATSAPP_CONFIG.numeroRenata.replace(/\D/g, '');
        
        // ============================================
        // OPÇÃO 1: Link direto para WhatsApp (mais simples)
        // ============================================
        // Isso abre o WhatsApp do navegador, mas não envia automaticamente
        // O cliente precisa clicar no link
        
        // Cria links para WhatsApp
        const linkCliente = `https://wa.me/55${numeroCliente}?text=${encodeURIComponent(msgCliente)}`;
        const linkRenata = `https://wa.me/55${numeroRenata}?text=${encodeURIComponent(msgRenata)}`;
        
        console.log('📱 Link para o cliente:', linkCliente);
        console.log('📱 Link para a Renata:', linkRenata);
        
        // ============================================
        // OPÇÃO 2: Usando API do WhatsApp (recomendado)
        // ============================================
        // Descomente se tiver API configurada
        
        /*
        // Envia para o cliente
        const respostaCliente = await fetch(WHATSAPP_CONFIG.apiUrl + '/send', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + WHATSAPP_CONFIG.apiToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phoneNumber: numeroCliente,
                message: msgCliente,
                template: null
            })
        });
        
        // Envia para a Renata
        const respostaRenata = await fetch(WHATSAPP_CONFIG.apiUrl + '/send', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + WHATSAPP_CONFIG.apiToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phoneNumber: numeroRenata,
                message: msgRenata,
                template: null
            })
        });
        */
        
        // Retorna os links (para abrir em nova janela)
        return { 
            cliente: linkCliente, 
            renata: linkRenata,
            mensagemCliente: msgCliente,
            mensagemRenata: msgRenata
        };
        
    } catch (error) {
        console.error('❌ Erro ao enviar WhatsApp:', error);
        return { error: error.message };
    }
}