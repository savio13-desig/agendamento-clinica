/* Dados da clínica. Para vender a outra clínica, troque só este arquivo e as cores no :root de css/estilo.css. */
window.CLINICA = {
  nome: "Clínica Marés",
  slogan: "Medicina dentária e saúde · Faro",
  endereco: "Rua Exemplo, 123 · 8000-000 Faro, Algarve",
  whatsapp: "351910000000", // número que recebe as confirmações (351 + 9 dígitos)
  passoMin: 30,              // intervalo entre horários, em minutos
  antecedenciaMin: 120,      // antecedência mínima para marcar no mesmo dia
  diasAFrente: 21,
  /* horário por dia da semana (0 = domingo). Sem a chave = fechado. */
  horarios: {
    1: [["09:00", "13:00"], ["14:30", "19:00"]],
    2: [["09:00", "13:00"], ["14:30", "19:00"]],
    3: [["09:00", "13:00"], ["14:30", "19:00"]],
    4: [["09:00", "13:00"], ["14:30", "19:00"]],
    5: [["09:00", "13:00"], ["14:30", "18:00"]],
    6: [["09:00", "13:00"]]
  },
  profissionais: [
    { id: 1, nome: "Dra. Marta Silva", ini: "M", esp: "Medicina dentária geral" },
    { id: 2, nome: "Dr. Tiago Costa", ini: "T", esp: "Ortodontia" },
    { id: 3, nome: "Inês Rocha", ini: "I", esp: "Higiene oral" }
  ],
  servicos: [
    { id: 1, nome: "Consulta de avaliação", desc: "Primeira consulta, exame e plano de tratamento.", dur: 30, preco: 35, tag: "Primeira vez" },
    { id: 2, nome: "Destartarização e higiene oral", desc: "Limpeza profissional e aconselhamento de higiene.", dur: 60, preco: 55 },
    { id: 3, nome: "Consulta de ortodontia", desc: "Avaliação e acompanhamento de aparelho.", dur: 30, preco: 45 },
    { id: 4, nome: "Branqueamento dentário", desc: "Sessão em consultório, com avaliação prévia.", dur: 90, preco: 190 },
    { id: 5, nome: "Tratamento de cárie", desc: "Restauração, com anestesia local se necessário.", dur: 60, preco: 70 },
    { id: 6, nome: "Consulta de urgência", desc: "Dor ou dente partido. Encaixamos no mesmo dia.", dur: 30, preco: 40, tag: "Urgência" }
  ]
};
