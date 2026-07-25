// ============================================
// SISTEMA DE NOTIFICAÇÕES POR E-MAIL (EMAILJS)
// ============================================

// ============================================
// CONFIGURAÇÃO DO EMAILJS
// ============================================
const EMAILJS_CONFIG = {
    publicKey: 'rRmq87DuOwPzW-3Eo',
    serviceID: 'service_4gybw6a',
    templateID: 'template_levita'
};

// ============================================
// CARREGAR EMAILJS
// ============================================
(function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = function() {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('✅ EmailJS carregado!');
        console.log('📧 Service ID:', EMAILJS_CONFIG.serviceID);
        console.log('📧 Template ID:', EMAILJS_CONFIG.templateID);
    };
    script.onerror = function() {
        console.error('❌ Erro ao carregar EmailJS');
    };
    document.head.appendChild(script);
})();

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
// FUNÇÃO PARA ENVIAR E-MAIL VIA EMAILJS
// ============================================
async function enviarEmail(destinatario, assunto, html) {
    try {
        console.log('📧 Enviando e-mail para:', destinatario);
        console.log('📧 Assunto:', assunto);
        
        if (typeof emailjs === 'undefined') {
            console.error('❌ EmailJS não carregado!');
            return { success: false, error: 'EmailJS não carregado' };
        }
        
        const templateParams = {
            to_email: destinatario,
            to_name: destinatario.split('@')[0] || 'Cliente',
            subject: assunto,
            message: html.replace(/<[^>]*>/g, '').substring(0, 500),
            html_message: html
        };
        
        console.log('📤 Enviando com parâmetros:', templateParams);
        
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceID,
            EMAILJS_CONFIG.templateID,
            templateParams
        );
        
        console.log('✅ E-mail enviado com sucesso!', response);
        return { success: true, data: response };
        
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
        console.log('📧 Public Key:', EMAILJS_CONFIG.publicKey ? '✅ Configurado' : '❌ NÃO CONFIGURADO');
        console.log('📧 Service ID:', EMAILJS_CONFIG.serviceID);
        console.log('📧 Template ID:', EMAILJS_CONFIG.templateID);
        
        const emailClienteHTML = gerarEmailClienteHTML(dados);
        const emailRenataHTML = gerarEmailRenataHTML(dados);
        
        // Extrair variáveis para o template
        const dataObj = new Date(dados.data + 'T00:00:00');
        const dataFormatada = dataObj.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        const tipoLabel = dados.tipo === 'domicilio' ? '🏠 Domiciliar' : '🏢 Presencial';
        const statusLabel = dados.status.charAt(0).toUpperCase() + dados.status.slice(1);
        
        // Enviar para o cliente
        let clienteResult = { success: false };
        if (dados.email && dados.email !== '') {
            const templateParamsCliente = {
                to_email: dados.email,
                to_name: dados.nome,
                subject: '✅ Agendamento Confirmado - Levità Podologia',
                servico: dados.servico,
                data: dataFormatada,
                horario: dados.horario,
                tipo: tipoLabel,
                endereco: dados.endereco || 'Presencial - Clínica',
                status: statusLabel,
                protocolo: '#' + String(dados.id).padStart(5, '0')
            };
            
            clienteResult = await emailjs.send(
                EMAILJS_CONFIG.serviceID,
                EMAILJS_CONFIG.templateID,
                templateParamsCliente
            ).then(function(response) {
                console.log('✅ E-mail para o cliente enviado!', response);
                return { success: true, data: response };
            }).catch(function(error) {
                console.error('❌ Erro ao enviar e-mail para o cliente:', error);
                return { success: false, error: error };
            });
            console.log('📧 E-mail para o cliente:', clienteResult.success ? '✅ Enviado' : '❌ Falhou');
        } else {
            console.warn('⚠️ Cliente sem e-mail.');
        }
        
        // Enviar para a Renata
        const templateParamsRenata = {
            to_email: 'contato@levitapodologia.com.br',
            to_name: 'Renata Kemp',
            subject: '🔔 NOVO AGENDAMENTO - ' + dados.nome,
            servico: dados.servico,
            data: dataFormatada,
            horario: dados.horario,
            tipo: tipoLabel,
            endereco: dados.endereco || 'Presencial - Clínica',
            status: statusLabel,
            protocolo: '#' + String(dados.id).padStart(5, '0')
        };
        
        const renataResult = await emailjs.send(
            EMAILJS_CONFIG.serviceID,
            EMAILJS_CONFIG.templateID,
            templateParamsRenata
        ).then(function(response) {
            console.log('✅ E-mail para a Renata enviado!', response);
            return { success: true, data: response };
        }).catch(function(error) {
            console.error('❌ Erro ao enviar e-mail para a Renata:', error);
            return { success: false, error: error };
        });
        console.log('📧 E-mail para a Renata:', renataResult.success ? '✅ Enviado' : '❌ Falhou');
        
        return {
            sucesso: true,
            cliente: clienteResult.success ? 'enviado' : 'falhou',
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
        const dataObj = new Date(dados.data + 'T00:00:00');
        const dataFormatada = dataObj.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        const tipoLabel = dados.tipo === 'domicilio' ? '🏠 Domiciliar' : '🏢 Presencial';
        const statusLabel = dados.status.charAt(0).toUpperCase() + dados.status.slice(1);
        
        const templateParams = {
            to_email: 'contato@levitapodologia.com.br',
            to_name: 'Renata Kemp',
            subject: '🔔 NOVO AGENDAMENTO - ' + dados.nome,
            servico: dados.servico,
            data: dataFormatada,
            horario: dados.horario,
            tipo: tipoLabel,
            endereco: dados.endereco || 'Presencial - Clínica',
            status: statusLabel,
            protocolo: '#' + String(dados.id).padStart(5, '0')
        };
        
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceID,
            EMAILJS_CONFIG.templateID,
            templateParams
        );
        console.log('✅ E-mail para a Renata enviado!', response);
        return { success: true, data: response };
        
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

console.log('✅ Sistema de e-mail carregado (EmailJS)!');