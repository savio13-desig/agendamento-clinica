# Marcação de consultas online para clínicas (amostra novapicks)

Demonstração para vender a clínicas dentárias, de estética e de fisioterapia. HTML, CSS e JavaScript puros, sem build e sem servidor. Português de Portugal, preços em euro, dados fictícios.

- `index.html` — página do utente: serviço, profissional, data e hora, confirmação com código, WhatsApp e calendário.
- `minha-reserva.html` — ver, remarcar ou cancelar pelo código.
- `painel.html` — agenda da clínica por profissional, encaixe, bloqueio de horários e serviços/preços.
- `qr.html` — placa de QR para imprimir.
- `apresentacao.html` — proposta com planos de exemplo.

Para vender a uma clínica real, edite `js/dados.js` (nome, morada, WhatsApp, horários, equipa, serviços) e as cores em `css/estilo.css` (`:root`). Os dados da amostra ficam no `localStorage` do navegador.
