/* Camada de dados e regras da agenda. Guarda no navegador (localStorage) na amostra;
   em produção, troca por um banco online sem mudar as telas. */
window.Agenda = (function () {
  "use strict";
  var C = window.CLINICA;
  var KS = "cl-servicos:v1", KN = "cl-servicos-novos:v1", KA = "cl-agendamentos:v1", KB = "cl-bloqueios:v1", KM = "cl-meus:v1";
  function ler(k, def) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; } catch (e) { return def; } }
  function gravar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  function dstr(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function parse(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function min(hm) { var p = hm.split(":"); return +p[0] * 60 + +p[1]; }
  function hm(m) { return pad(Math.floor(m / 60)) + ":" + pad(m % 60); }
  function soDigitos(t) { return String(t || "").replace(/\D/g, ""); }
  var DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  var MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  function dataLonga(s) { var d = parse(s); return DIAS[d.getDay()] + ", " + d.getDate() + " de " + MESES[d.getMonth()]; }
  var brl = function (v) { return v.toLocaleString("pt-PT", { style: "currency", currency: "EUR" }); };

  function servicos() {
    var o = ler(KS, {});
    return C.servicos.concat(ler(KN, [])).map(function (s) { return Object.assign({ ativo: true }, s, o[s.id] || {}); });
  }
  function servico(id) { return servicos().filter(function (s) { return s.id === Number(id); })[0]; }
  function prof(id) { return C.profissionais.filter(function (p) { return p.id === Number(id); })[0]; }
  function agendamentos() { return ler(KA, []); }
  function bloqueios() { return ler(KB, []); }

  /* horários livres de um dia. profId 0 = qualquer profissional. */
  function slots(data, profId, dur, opts) {
    opts = opts || {};
    var d = parse(data), jan = C.horarios[d.getDay()], agora = new Date();
    if (!jan || data < dstr(agora)) return [];
    var hoje = data === dstr(agora), limite = agora.getHours() * 60 + agora.getMinutes() + (opts.semLimite ? -9999 : C.antecedenciaMin);
    var profs = profId ? [Number(profId)] : C.profissionais.map(function (p) { return p.id; });
    var ags = agendamentos().filter(function (a) { return a.data === data && a.status === "agendado" && a.id !== opts.ignorar; });
    var bl = bloqueios().filter(function (b) { return b.data === data; });
    function livre(p, t) {
      return !ags.some(function (a) { return a.profId === p && t < min(a.hora) + a.dur && min(a.hora) < t + dur; }) &&
        !bl.some(function (b) { return (b.profId === 0 || b.profId === p) && t < min(b.fim) && min(b.ini) < t + dur; });
    }
    var out = {};
    jan.forEach(function (j) {
      for (var t = min(j[0]); t + dur <= min(j[1]); t += C.passoMin) {
        if (hoje && t < limite) continue;
        if (out[hm(t)]) continue;
        for (var i = 0; i < profs.length; i++) if (livre(profs[i], t)) { out[hm(t)] = profs[i]; break; }
      }
    });
    return Object.keys(out).sort().map(function (h) { return { hora: h, prof: out[h] }; });
  }

  function codigo() {
    var c = ""; for (var i = 0; i < 5; i++) c += "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".charAt(Math.floor(Math.random() * 32));
    return c;
  }
  /* cria o agendamento se o horário continua livre; devolve null se alguém ocupou antes */
  function criar(a, opts) {
    var s = servico(a.servId);
    if (!slots(a.data, a.profId, s.dur, opts).some(function (x) { return x.hora === a.hora && x.prof === a.profId; })) {
      // com profissional "qualquer", o horário vale se algum estiver livre
      return null;
    }
    var l = agendamentos();
    a = Object.assign({}, a, { id: l.reduce(function (m, x) { return Math.max(m, x.id); }, 0) + 1, cod: codigo(), servNome: s.nome, preco: s.preco, dur: s.dur, status: "agendado", criado: new Date().toISOString() });
    l.push(a); gravar(KA, l); return a;
  }
  function mudar(id, patch) { var l = agendamentos(); l.forEach(function (a) { if (a.id === id) Object.assign(a, patch); }); gravar(KA, l); }
  function porCodigo(c) { return agendamentos().filter(function (a) { return a.cod === String(c || "").toUpperCase(); })[0]; }
  function lembrar(cod) { var m = ler(KM, []); if (m.indexOf(cod) < 0) m.push(cod); gravar(KM, m); }
  function meus() { var m = ler(KM, []); return agendamentos().filter(function (a) { return m.indexOf(a.cod) > -1; }); }

  function addBloqueio(b) { var l = bloqueios(); b.id = l.reduce(function (m, x) { return Math.max(m, x.id); }, 0) + 1; l.push(b); gravar(KB, l); }
  function remBloqueio(id) { gravar(KB, bloqueios().filter(function (b) { return b.id !== id; })); }

  function novoServico(s) { var l = ler(KN, []); s.id = l.reduce(function (m, x) { return Math.max(m, x.id); }, 100) + 1; s.custom = true; l.push(s); gravar(KN, l); return s; }
  function removerServico(id) { gravar(KN, ler(KN, []).filter(function (x) { return x.id !== id; })); }
  function salvarServico(id, patch) { var o = ler(KS, {}); o[id] = Object.assign(o[id] || {}, patch); gravar(KS, o); }


  /* agenda de exemplo para demonstrações, a partir de hoje */
  function exemplo() {
    var nomes = [["Ana Ferreira", "910000001"], ["João Pereira", "910000002"], ["Rita Gonçalves", "910000003"], ["Miguel Santos", "910000004"], ["Sofia Marques", "910000005"], ["Pedro Ramos", "910000006"]];
    var hoje = new Date(), n = 0, plano = [[1, 1, "10:00", 1], [2, 3, "10:00", 3], [3, 2, "10:00", 2], [1, 5, "15:00", 4], [2, 3, "16:00", 5], [1, 6, "17:30", 6]];
    for (var d = 0; d < 3; d++) {
      var dt = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + d), ds = dstr(dt);
      if (!C.horarios[dt.getDay()]) continue;
      plano.forEach(function (p) {
        var s = servico(p[1]), cli = nomes[(n++) % nomes.length];
        criar({ servId: s.id, profId: p[0], data: ds, hora: p[2], nome: cli[0], tel: cli[1], origem: "site" }, { semLimite: true });
      });
    }
  }
  function limparTudo() { [KS, KN, KA, KB, KM].forEach(function (k) { try { localStorage.removeItem(k); } catch (e) {} }); }
  function aoMudar(fn) { window.addEventListener("storage", function (e) { if (!e.key || /^cl-/.test(e.key)) fn(); }); }

  return { C: C, dstr: dstr, parse: parse, min: min, hm: hm, dataLonga: dataLonga, brl: brl, soDigitos: soDigitos, DIAS: DIAS, MESES: MESES,
    servicos: servicos, servico: servico, prof: prof, agendamentos: agendamentos, bloqueios: bloqueios, slots: slots, criar: criar, mudar: mudar,
    porCodigo: porCodigo, lembrar: lembrar, meus: meus, addBloqueio: addBloqueio, remBloqueio: remBloqueio, novoServico: novoServico,
    removerServico: removerServico, salvarServico: salvarServico, exemplo: exemplo, limparTudo: limparTudo, aoMudar: aoMudar };
})();
