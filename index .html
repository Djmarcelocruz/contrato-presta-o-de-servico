<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>DJ Brow - Sistema Profissional</title>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/signature_pad@4.0.0/dist/signature_pad.umd.min.js"></script>

<style>
  :root { --primary: #0b76d1; --secondary: #28a745; --dark: #212529; --light: #f8f9fa; }
  body { font-family: 'Segoe UI', sans-serif; background: #eef1f6; color: var(--dark); margin: 0; padding: 20px; }
  .container { max-width: 900px; margin: auto; background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
  
  /* Tabs */
  .tabs { display: flex; gap: 10px; margin-bottom: 25px; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
  .tab-btn { padding: 10px 20px; cursor: pointer; border: none; background: none; font-weight: bold; color: #666; transition: 0.3s; }
  .tab-btn.active { color: var(--primary); border-bottom: 3px solid var(--primary); }
  
  .section { display: none; }
  .section.active { display: block; }

  /* Grid e Inputs */
  .row { display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 15px; }
  .col { flex: 1; min-width: 200px; }
  label { display: block; font-weight: 600; font-size: 14px; margin-bottom: 5px; }
  input, textarea, select { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box; }
  
  /* Assinatura */
  .signature-wrapper { border: 2px dashed #ccc; background: #fafafa; margin-top: 10px; border-radius: 8px; position: relative; }
  canvas { width: 100%; height: 200px; cursor: crosshair; }
  .sig-buttons { margin-top: 5px; text-align: right; }

  /* Botões */
  .btn-group { margin-top: 30px; display: flex; gap: 10px; }
  .btn { padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; color: white; transition: 0.3s; }
  .btn-primary { background: var(--primary); }
  .btn-secondary { background: var(--secondary); }
  .btn-clear { background: #dc3545; }

  /* Área do PDF (Oculta) */
  #pdf-template { display: none; }

  @media (max-width: 600px) { .row { flex-direction: column; } }
</style>
</head>
<body>

<div class="container">
  <h1 style="text-align:center; color: var(--primary);">DJ Brow - Business Suite</h1>
  
  <div class="tabs">
    <button class="tab-btn active" onclick="openTab(event, 'tab-contrato')">Contrato</button>
    <button class="tab-btn" onclick="openTab(event, 'tab-recibo')">Recibo</button>
  </div>

  <div id="tab-contrato" class="section active">
    <h3>Dados do Cliente</h3>
    <div class="row">
        <div class="col"><label>Nome do Cliente</label><input type="text" id="cli_nome"></div>
        <div class="col"><label>CPF</label><input type="text" id="cli_cpf"></div>
    </div>
    <div class="row">
        <div class="col"><label>Evento</label><input type="text" id="evt_local" placeholder="Ex: Chácara São João"></div>
        <div class="col"><label>Data</label><input type="date" id="evt_data"></div>
    </div>
    <div class="row">
        <div class="col"><label>Valor Total (R$)</label><input type="text" id="evt_valor"></div>
        <div class="col"><label>Condições</label><input type="text" id="evt_pagamento" placeholder="Ex: 50% entrada"></div>
    </div>
    <label>Descrição dos Serviços</label>
    <textarea id="evt_servicos" rows="3"></textarea>
  </div>

  <div id="tab-recibo" class="section">
    <h3>Emitir Recibo</h3>
    <div class="row">
        <div class="col"><label>Recebi de:</label><input type="text" id="rec_nome"></div>
        <div class="col"><label>A importância de (R$):</label><input type="text" id="rec_valor"></div>
    </div>
    <div class="row">
        <div class="col"><label>Referente a:</label><input type="text" id="rec_referente" placeholder="Ex: Sinal do contrato de casamento"></div>
    </div>
    <div class="row">
        <div class="col"><label>Data do Pagamento</label><input type="date" id="rec_data"></div>
    </div>
  </div>

  <h3>Assinatura Digital (Contratante)</h3>
  <div class="signature-wrapper">
    <canvas id="signature-pad"></canvas>
  </div>
  <div class="sig-buttons">
    <button class="btn btn-clear" onclick="signaturePad.clear()" style="padding: 5px 10px; font-size: 12px;">Limpar Assinatura</button>
  </div>

  <div class="btn-group">
    <button class="btn btn-primary" onclick="generatePDF('contrato')">Baixar Contrato PDF</button>
    <button class="btn btn-secondary" onclick="generatePDF('recibo')">Baixar Recibo PDF</button>
  </div>
</div>

<div id="pdf-template">
    <div id="pdf-inner" style="padding: 40px; font-family: serif;">
        <center><h1 id="pdf-title">TITULO</h1></center>
        <div id="pdf-body" style="text-align: justify; line-height: 1.6; margin-top: 20px;"></div>
        <div id="pdf-signature-area" style="margin-top: 50px;">
            <p id="pdf-date-loc"></p>
            <br>
            <img id="pdf-sig-img" style="max-width: 250px; border-bottom: 1px solid #000;"><br>
            <span>Assinatura do Contratante</span>
        </div>
    </div>
</div>

<script>
// Inicialização da Assinatura
const canvas = document.getElementById('signature-pad');
const signaturePad = new SignaturePad(canvas);

// Ajustar tamanho do canvas
function resizeCanvas() {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
}
window.onresize = resizeCanvas;
resizeCanvas();

// Navegação de Abas
function openTab(evt, tabName) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// Gerador de PDF Profissional
async function generatePDF(type) {
    const pdfBody = document.getElementById('pdf-body');
    const pdfTitle = document.getElementById('pdf-title');
    const pdfDateLoc = document.getElementById('pdf-date-loc');
    
    if (signaturePad.isEmpty()) {
        alert("Por favor, peça ao cliente para assinar antes de gerar o PDF.");
        return;
    }

    const sigData = signaturePad.toDataURL(); // Pega a imagem da assinatura
    document.getElementById('pdf-sig-img').src = sigData;

    if (type === 'contrato') {
        const nome = document.getElementById('cli_nome').value || '---';
        const serv = document.getElementById('evt_servicos').value || 'Serviços de DJ e Sonorização';
        pdfTitle.innerText = "CONTRATO DE PRESTAÇÃO DE SERVIÇOS";
        pdfBody.innerHTML = `
            <p>Pelo presente instrumento, o contratante <strong>${nome}</strong>, inscrito sob o CPF <strong>${document.getElementById('cli_cpf').value}</strong>, 
            contrata os serviços de <strong>DJ Brow (Marcelo da Cruz)</strong> para o evento em <strong>${document.getElementById('evt_local').value}</strong> 
            no dia <strong>${document.getElementById('evt_data').value}</strong>.</p>
            <p><strong>Descrição dos Serviços:</strong> ${serv}</p>
            <p><strong>Valor Acordado:</strong> R$ ${document.getElementById('evt_valor').value} conforme condições: ${document.getElementById('evt_pagamento').value}.</p>
        `;
    } else {
        pdfTitle.innerText = "RECIBO DE PAGAMENTO";
        pdfBody.innerHTML = `
            <p>Recebi de <strong>${document.getElementById('rec_nome').value}</strong> a importância de 
            <strong>R$ ${document.getElementById('rec_valor').value}</strong> referente a 
            <strong>${document.getElementById('rec_referente').value}</strong>.</p>
            <p>Pelo que firmo o presente para dar plena quitação.</p>
        `;
    }

    pdfDateLoc.innerText = `Documento emitido em ${new Date().toLocaleDateString('pt-BR')}`;

    // Configuração do html2pdf
    const element = document.getElementById('pdf-inner');
    const opt = {
        margin: 1,
        filename: `${type}_${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
}
</script>
</body>
</html>
