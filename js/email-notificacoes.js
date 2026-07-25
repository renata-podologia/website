// ============================================
// SISTEMA DE NOTIFICAÇÕES POR E-MAIL
// ============================================

// ============================================
// CARREGAR CONFIGURAÇÕES DOS SECRETS
// ============================================

let RESEND_KEY = '';
let RESEND_FROM = 'contato@resend.dev';
let RESEND_TO = 'contato@levitapodologia.com.br';

try {
    if (typeof CONFIG !== 'undefined') {
        RESEND_KEY = CONFIG.RESEND_API_KEY || '';
        console.log('✅ Configuração Resend carregada do GitHub Secrets!');
    } else {
        console.warn('⚠️ Arquivo config.js não encontrado. Usando fallback.');
        RESEND_KEY = 'SUA_RESEND_API_KEY_AQUI';
    }
} catch(e) {
    console.warn('⚠️ Erro ao carregar configuração:', e);
    RESEND_KEY = 'SUA_RESEND_API_KEY_AQUI';
}

const EMAIL_CONFIG = {
    apiKey: RESEND_KEY,
    from: RESEND_FROM,
    to: RESEND_TO,
    nomeEmpresa: 'Levità Podologia',
    telefone: '(11) 97830-3833'
};

console.log('📧 Resend API Key:', RESEND_KEY ? (RESEND_KEY === 'SUA_RESEND_API_KEY_AQUI' ? '⚠️ NÃO CONFIGURADO' : '✅ Configurado') : '❌ NÃO CONFIGURADO');

// ============================================
// GERAR E-MAIL PARA O CLIENTE (TEXTO)
// ============================================
function gerarEmailCliente(dados) {
    const dataObj = new Date(dados.data + 'T00:00:00');
    const dataFormatada = dataObj.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const tipoLabel = dados.tipo === 'domicilio' ? '🏠 Domiciliar' : '🏢 Presencial';
    const statusLabel = dados.status.charAt(0).toUpperCase() + dados.status.slice(1);
    
    return `
✅ *Agendamento Confirmado - Levità Podologia*

Olá *${dados.nome}*, seu agendamento foi realizado com sucesso! 🎉

📋 *Serviço:* ${dados.servico}
📅 *Data:* ${dataFormatada}
⏰ *Horário:* ${dados.horario}
📍 *Tipo:* ${tipoLabel}
🏠 *Endereço:* ${dados.endereco || 'Presencial - Clínica'}
📌 *Status:* ${statusLabel}
🔑 *Protocolo:* #${String(dados.id).padStart(5, '0')}

📌 *Próximos passos:*
• Anote a data e horário
• Em caso de imprevistos, entre em contato
• Aguarde nossa confirmação

📱 *Dúvidas?* Fale conosco: wa.me/5511978303833

Agradecemos pela confiança! 🙏

*Levitação Podologia - Podóloga Renata Kemp*
`;
}

// ============================================
// GERAR E-MAIL PARA A RENATA (TEXTO)
// ============================================
function gerarEmailRenata(dados) {
    const dataObj = new Date(dados.data + 'T00:00:00');
    const dataFormatada = dataObj.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const tipoLabel = dados.tipo === 'domicilio' ? '🏠 Domiciliar' : '🏢 Presencial';
    const statusLabel = dados.status.charAt(0).toUpperCase() + dados.status.slice(1);
    
    return `
🔔 *NOVO AGENDAMENTO!*

👤 *Paciente:* ${dados.nome}
📱 *Telefone:* ${dados.telefone}
📧 *E-mail:* ${dados.email || 'Não informado'}
📋 *Serviço:* ${dados.servico}
📅 *Data:* ${dataFormatada}
⏰ *Horário:* ${dados.horario}
📍 *Tipo:* ${tipoLabel}
🏠 *Endereço:* ${dados.endereco || 'Presencial - Clínica'}
📌 *Status:* ${statusLabel}
🔑 *Protocolo:* #${String(dados.id).padStart(5, '0')}

📌 *Ações recomendadas:*
✅ Confirmar o agendamento
📱 Entrar em contato com o paciente
📝 Verificar o endereço (se for domicílio)

🔗 *Ver no painel:* https://renata-podologia.github.io/website/admin.html
`;
}

// ============================================
// GERAR E-MAIL EM HTML PARA O CLIENTE
// ============================================
function gerarEmailClienteHTML(dados) {
    const dataObj = new Date(dados.data + 'T00:00:00');
    const dataFormatada = dataObj.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const tipoLabel = dados.tipo === 'domicilio' ? '🏠 Domiciliar' : '🏢 Presencial';
    const statusLabel = dados.status.charAt(0).toUpperCase() + dados.status.slice(1);
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background: #f7f8fa; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { text-align: center; border-bottom: 2px solid #C9A227; padding-bottom: 20px; margin-bottom: 20px; }
        .header h1 { color: #2F5D62; font-family: 'Poppins', sans-serif; }
        .header h1 span { color: #C9A227; }
        .info { background: #F4EFE8; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #C9A227; }
        .info p { margin: 8px 0; }
        .label { font-weight: 600; color: #2F5D62; }
        .status { display: inline-block; padding: 4px 16px; border-radius: 30px; background: #fff3cd; color: #856404; font-weight: 600; font-size: 0.85rem; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e8edee; color: #4a5f64; font-size: 0.9rem; }
        .btn { display: inline-block; padding: 12px 30px; background: #25D366; color: #fff; text-decoration: none; border-radius: 50px; font-weight: 600; }
        .protocolo { display: inline-block; padding: 4px 16px; background: #2F5D62; color: #fff; border-radius: 30px; font-size: 0.85rem; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Levita<span>.</span></h1>
            <p style="color: #4a5f64;">Podóloga Renata Kemp</p>
        </div>
        
        <h2 style="color: #2F5D62;">✅ Agendamento Confirmado!</h2>
        <p>Olá <strong>${dados.nome}</strong>, seu agendamento foi realizado com sucesso!</p>
        
        <div class="info">
            <p><span class="label">📋 Serviço:</span> ${dados.servico}</p>
            <p><span class="label">📅 Data:</span> ${dataFormatada}</p>
            <p><span class="label">⏰ Horário:</span> ${dados.horario}</p>
            <p><span class="label">📍 Tipo:</span> ${tipoLabel}</p>
            <p><span class="label">🏠 Endereço:</span> ${dados.endereco || 'Presencial - Clínica'}</p>
            <p><span class="label">📌 Status:</span> <span class="status">${statusLabel}</span></p>
        </div>
        
        <p style="text-align: center;">
            <span class="protocolo">#${String(dados.id).padStart(5, '0')}</span>
        </p>
        
        <p><strong>📌 O que fazer agora?</strong></p>
        <ul style="color: #4a5f64; line-height: 2;">
            <li>✅ Anote a data e horário</li>
            <li>📱 Em caso de imprevistos, entre em contato pelo WhatsApp</li>
            <li>🏠 Se for atendimento domiciliar, aguarde a confirmação do endereço</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://wa.me/5511978303833" class="btn">
                📱 Falar com Renata no WhatsApp
            </a>
        </div>
        
        <div class="footer">
            <p><strong>Levitação Podologia - Podóloga Renata Kemp</strong></p>
            <p>📱 (11) 97830-3833 | 📧 contato@levitapodologia.com.br</p>
            <p style="font-size: 0.8rem; margin-top: 8px;">
                🌐 <a href="https://renata-podologia.github.io/website/" style="color: #2F5D62;">renata-podologia.github.io/website</a>
            </p>
            <p style="font-size: 0.7rem; color: #8a9ea3; margin-top: 12px;">
                Este é um e-mail automático, não responda diretamente.
            </p>
        </div>
    </div>
</body>
</html>
    `;
}

// ============================================
// GERAR E-MAIL EM HTML PARA A RENATA
// ============================================
function gerarEmailRenataHTML(dados) {
    const dataObj = new Date(dados.data + 'T00:00:00');
    const dataFormatada = dataObj.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const tipoLabel = dados.tipo === 'domicilio' ? '🏠 Domiciliar' : '🏢 Presencial';
    const statusLabel = dados.status.charAt(0).toUpperCase() + dados.status.slice(1);
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background: #f7f8fa; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { text-align: center; border-bottom: 2px solid #C9A227; padding-bottom: 20px; margin-bottom: 20px; }
        .header h1 { color: #2F5D62; font-family: 'Poppins', sans-serif; }
        .header h1 span { color: #C9A227; }
        .destaque { background: #F4EFE8; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #C9A227; }
        .destaque p { margin: 6px 0; }
        .label { font-weight: 600; color: #2F5D62; }
        .badge { display: inline-block; padding: 4px 16px; border-radius: 30px; background: #fff3cd; color: #856404; font-weight: 600; font-size: 0.85rem; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e8edee; color: #4a5f64; font-size: 0.9rem; }
        .btn-admin { display: inline-block; padding: 12px 30px; background: #2F5D62; color: #fff; text-decoration: none; border-radius: 50px; font-weight: 600; }
        .acoes { background: #f8f9fa; padding: 16px; border-radius: 12px; margin: 20px 0; }
        .acoes ul { color: #4a5f64; line-height: 2; padding-left: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Levita<span>.</span></h1>
            <p style="color: #4a5f64;">🔔 Novo Agendamento Recebido</p>
        </div>
        
        <h2 style="color: #2F5D62;">📋 Dados do Agendamento</h2>
        
        <div class="destaque">
            <p><span class="label">👤 Paciente:</span> <strong>${dados.nome}</strong></p>
            <p><span class="label">📱 Telefone:</span> ${dados.telefone}</p>
            <p><span class="label">📧 E-mail:</span> ${dados.email || 'Não informado'}</p>
            <p><span class="label">📋 Serviço:</span> ${dados.servico}</p>
            <p><span class="label">📅 Data:</span> ${dataFormatada}</p>
            <p><span class="label">⏰ Horário:</span> ${dados.horario}</p>
            <p><span class="label">📍 Tipo:</span> ${tipoLabel}</p>
            <p><span class="label">🏠 Endereço:</span> ${dados.endereco || 'Presencial - Clínica'}</p>
            <p><span class="label">📌 Status:</span> <span class="badge">${statusLabel}</span></p>
            <p style="margin-top: 8px;">
                <span style="display: inline-block; padding: 2px 12px; background: #2F5D62; color: #fff; border-radius: 30px; font-size: 0.75rem; font-weight: 600;">
                    #${String(dados.id).padStart(5, '0')}
                </span>
            </p>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
            <a href="https://renata-podologia.github.io/website/admin.html" class="btn-admin">
                📊 Ver no Painel Administrativo
            </a>
        </div>
        
        <div class="acoes">
            <h4 style="color: #2F5D62; margin-bottom: 8px;">📌 Ações Recomendadas:</h4>
            <ul>
                <li>✅ Confirmar o agendamento no painel</li>
                <li>📱 Entrar em contato com o paciente</li>
                <li>📝 Verificar o endereço (se for domicílio)</li>
            </ul>
        </div>
        
        <div class="footer">
            <p><strong>Levitação Podologia - Podóloga Renata Kemp</strong></p>
            <p style="font-size: 0.8rem; color: #8a9ea3;">
                E-mail automático - ${new Date().toLocaleString('pt-BR')}
            </p>
        </div>
    </div>
</body>
</html>
    `;
}

// ============================================
// FUNÇÃO PARA ENVIAR E-MAIL
// ============================================
async function enviarEmail(destinatario, assunto, html) {
    try {
        console.log('📧 Enviando e-mail para:', destinatario);
        console.log('📧 Assunto:', assunto);
        
        if (!EMAIL_CONFIG.apiKey || EMAIL_CONFIG.apiKey === 'SUA_RESEND_API_KEY_AQUI') {
            console.error('❌ Resend API Key não configurada!');
            console.error('⚠️ Configure o secret RESEND_API_KEY no GitHub');
            return { success: false, error: 'API Key não configurada' };
        }
        
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + EMAIL_CONFIG.apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: EMAIL_CONFIG.from,
                to: [destinatario],
                subject: assunto,
                html: html
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ E-mail enviado com sucesso para:', destinatario);
            console.log('📋 Resposta:', data);
            return { success: true, data: data };
        } else {
            console.error('❌ Erro ao enviar e-mail:', data);
            return { success: false, error: data };
        }
        
    } catch (error) {
        console.error('❌ Erro ao enviar e-mail:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// FUNÇÃO PRINCIPAL - ENVIAR NOTIFICAÇÕES
// ============================================
async function enviarNotificacoesEmail(dados) {
    try {
        console.log('📧 Enviando notificações por e-mail...');
        console.log('📧 API Key configurada:', EMAIL_CONFIG.apiKey ? (EMAIL_CONFIG.apiKey === 'SUA_RESEND_API_KEY_AQUI' ? '❌ Não' : '✅ Sim') : '❌ Não');
        
        if (!dados.email || dados.email === '') {
            console.warn('⚠️ Cliente sem e-mail. Pulando e-mail para o cliente.');
        } else {
            const emailCliente = gerarEmailClienteHTML(dados);
            const clienteResult = await enviarEmail(
                dados.email,
                '✅ Agendamento Confirmado - Levità Podologia',
                emailCliente
            );
            console.log('📧 E-mail para o cliente:', clienteResult.success ? '✅ Enviado' : '❌ Falhou');
        }
        
        const emailRenata = gerarEmailRenataHTML(dados);
        const renataResult = await enviarEmail(
            EMAIL_CONFIG.to,
            '🔔 NOVO AGENDAMENTO - ' + dados.nome,
            emailRenata
        );
        console.log('📧 E-mail para a Renata:', renataResult.success ? '✅ Enviado' : '❌ Falhou');
        
        return {
            sucesso: true,
            cliente: dados.email ? (clienteResult.success ? 'enviado' : 'falhou') : 'pulado',
            renata: renataResult.success ? 'enviado' : 'falhou'
        };
        
    } catch (error) {
        console.error('❌ Erro ao enviar e-mails:', error);
        return { sucesso: false, error: error.message };
    }
}

// ============================================
// FUNÇÃO SIMPLIFICADA - APENAS PARA RENATA
// ============================================
async function enviarEmailRenata(dados) {
    try {
        console.log('📧 Enviando e-mail para a Renata...');
        
        const emailRenata = gerarEmailRenataHTML(dados);
        const result = await enviarEmail(
            EMAIL_CONFIG.to,
            '🔔 NOVO AGENDAMENTO - ' + dados.nome,
            emailRenata
        );
        
        return result;
        
    } catch (error) {
        console.error('❌ Erro ao enviar e-mail para a Renata:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// EXPORTA AS FUNÇÕES
// ============================================
window.enviarNotificacoesEmail = enviarNotificacoesEmail;
window.enviarEmailRenata = enviarEmailRenata;
window.enviarEmail = enviarEmail;

console.log('✅ Sistema de e-mail carregado!');