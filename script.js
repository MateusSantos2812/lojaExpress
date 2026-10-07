const SEED_PRODUTOS = [
  {
    id: 101,
    nome: "Hambúrguer Gourmet Angus",
    categoria: "Lanches",
    preco: 32.0,
    precoAntigo: 38.0,
    estoque: 20,
    img: "🍔",
    rating: 4.9,
    totalRatings: 18,
    descricao: "Pão brioche e 180g de carne angus com queijo cheddar inglês.",
    avaliacoes: [
      {
        autor: "Mariana R.",
        rating: 5,
        texto: "Maravilhoso!",
        data: "10/09/2026",
      },
    ],
  },
  {
    id: 102,
    nome: "Pizza Margherita Especial",
    categoria: "Pizzas",
    preco: 58.0,
    precoAntigo: 68.0,
    estoque: 15,
    img: "🍕",
    rating: 4.8,
    totalRatings: 34,
    descricao: "Massa de fermentação natural de 48h com muçarela de búfala.",
    avaliacoes: [],
  },
  {
    id: 103,
    nome: "Refrigerante Cola Lata 350ml",
    categoria: "Bebidas",
    preco: 6.5,
    precoAntigo: 8.0,
    estoque: 50,
    img: "🥤",
    rating: 5.0,
    totalRatings: 42,
    descricao: "Lata gelada 350ml.",
    avaliacoes: [],
  },
  {
    id: 104,
    nome: "Smartphone Galaxy Ultra 5G",
    categoria: "Eletrônicos",
    preco: 2299.0,
    precoAntigo: 2699.0,
    estoque: 4,
    img: "📱",
    rating: 4.7,
    totalRatings: 12,
    descricao: "Tela AMOLED 120Hz, 128GB e Câmera 50MP.",
    avaliacoes: [],
  },
];

const SEED_CLIENTES = [
  {
    id: 1,
    nome: "Ana Beatriz Silva",
    email: "ana@email.com",
    senha: "123",
    cpf: "123.456.789-00",
    telefone: "(11) 98765-4321",
    endereco: "Rua das Palmeiras, 145",
    cidade: "São Paulo - SP",
  },
  {
    id: 2,
    nome: "Carlos Eduardo Souza",
    email: "carlos@email.com",
    senha: "123",
    cpf: "987.654.321-11",
    telefone: "(21) 97654-3210",
    endereco: "Av. Atlântica, 1020",
    cidade: "Rio de Janeiro - RJ",
  },
];

const SEED_CUPONS = [
  {
    codigo: "PROMO20",
    tipo: "pct",
    valor: 20,
    minPedido: 30,
    expiraEm: "2026-12-31",
    ativo: true,
    desc: "20% OFF acima de R$ 30",
  },
  {
    codigo: "PRIMEIRA10",
    tipo: "reais",
    valor: 10,
    minPedido: 40,
    expiraEm: "2026-12-31",
    ativo: true,
    desc: "R$ 10 OFF acima de R$ 40",
  },
];

const SEED_PEDIDOS = [
  {
    id: 1001,
    clienteId: 1,
    clienteNome: "Ana Beatriz Silva",
    data: "2026-09-12T10:00:00",
    status: "Entregue",
    total: 58.0,
    itens: [
      {
        produtoId: 102,
        nome: "Pizza Margherita Especial",
        qtd: 1,
        precoUnit: 58.0,
        subtotalItem: 58.0,
      },
    ],
  },
];

const SEED_CONFIG = {
  adminEmail: "admin@loja.com",
  adminSenha: "admin123",
};

function initDatabase() {
  if (!localStorage.getItem("db_produtos"))
    localStorage.setItem("db_produtos", JSON.stringify(SEED_PRODUTOS));
  if (!localStorage.getItem("db_clientes"))
    localStorage.setItem("db_clientes", JSON.stringify(SEED_CLIENTES));
  if (!localStorage.getItem("db_cupons"))
    localStorage.setItem("db_cupons", JSON.stringify(SEED_CUPONS));
  if (!localStorage.getItem("db_pedidos"))
    localStorage.setItem("db_pedidos", JSON.stringify(SEED_PEDIDOS));
  if (!localStorage.getItem("db_config"))
    localStorage.setItem("db_config", JSON.stringify(SEED_CONFIG));
}
initDatabase();

function getProdutos() {
  return JSON.parse(localStorage.getItem("db_produtos")) || [];
}
function getClientes() {
  return JSON.parse(localStorage.getItem("db_clientes")) || [];
}
function getCupons() {
  return JSON.parse(localStorage.getItem("db_cupons")) || [];
}
function getPedidos() {
  return JSON.parse(localStorage.getItem("db_pedidos")) || [];
}
function getConfig() {
  return JSON.parse(localStorage.getItem("db_config")) || SEED_CONFIG;
}

let state = {
  visao: "cliente",
  clienteLogado: JSON.parse(localStorage.getItem("sessao_cliente")) || null,
  adminLogado: JSON.parse(localStorage.getItem("sessao_admin")) || false,
  cart: [],
  cupomAplicado: null,
  produtoDetalheAtivo: null,
  qtdDetalhe: 1,
};

// ============================================================
// 2. CATÁLOGO & DETALHE DO PRODUTO (CLIENTE)
// ============================================================
function renderCatalogo(produtos) {
  const grid = document.getElementById("grid-produtos");
  if (!produtos || produtos.length === 0) {
    grid.innerHTML =
      "<p style='color:#888; padding:20px; grid-column:1/-1;'>Nenhum produto cadastrado.</p>";
    return;
  }
  grid.innerHTML = produtos
    .map((p) => {
      const avaliacoesCount =
        p.avaliacoes && Array.isArray(p.avaliacoes) ? p.avaliacoes.length : 0;
      const rating = (p.rating || 5.0).toFixed(1);
      return `
                <div class="product-card">
                    <div class="product-img" onclick="abrirDetalhe(${p.id})">${p.img || "📦"}</div>
                    <div class="product-body">
                        <div class="product-category">${p.categoria || "Geral"} &bull; Estoque: ${p.estoque || 0} un</div>
                        <div class="product-title" onclick="abrirDetalhe(${p.id})">${p.nome}</div>
                        <div class="product-rating" onclick="abrirDetalhe(${p.id})">⭐ ${rating} (${avaliacoesCount} avaliações)</div>
                        <div class="current-price">R$ ${(p.preco || 0).toFixed(2).replace(".", ",")}</div>
                        <button class="btn-view-details" onclick="abrirDetalhe(${p.id})">🔍 Ver Detalhes / Comprar</button>
                    </div>
                </div>
            `;
    })
    .join("");

  const pills = document.getElementById("banner-cupom-pills");
  pills.innerHTML = getCupons()
    .filter((c) => c.ativo)
    .map(
      (c) => `
                <span class="chip" onclick="copiarCupom('${c.codigo}')" style="background:rgba(255,255,255,0.25); color:white; border:1px dashed white;">
                    🎟️ ${c.codigo} (${c.tipo === "pct" ? c.valor + "%" : "R$ " + c.valor} OFF)
                </span>
            `,
    )
    .join("");
}

function abrirDetalhe(id) {
  const p = getProdutos().find((i) => i.id === id);
  if (!p) {
    alert("Produto não encontrado!");
    return;
  }

  // Garante lista de avaliações existente
  if (!p.avaliacoes || !Array.isArray(p.avaliacoes)) {
    p.avaliacoes = [];
  }

  state.produtoDetalheAtivo = p;
  state.qtdDetalhe = 1;

  document.getElementById("detalhe-img").innerText = p.img || "📦";
  document.getElementById("detalhe-categoria").innerText =
    p.categoria || "Geral";
  document.getElementById("detalhe-nome").innerText = p.nome;
  document.getElementById("detalhe-descricao").innerText =
    p.descricao || "Sem descrição cadastrada.";
  document.getElementById("detalhe-estoque-txt").innerText =
    p.estoque > 0
      ? `✅ Em estoque: ${p.estoque} unidades disponíveis`
      : `❌ Produto Esgotado`;
  document.getElementById("detalhe-preco").innerText =
    `R$ ${(p.preco || 0).toFixed(2).replace(".", ",")}`;
  document.getElementById("detalhe-rating").innerText =
    `⭐ ${(p.rating || 5.0).toFixed(1)} (${p.avaliacoes.length} avaliações)`;

  atualizarSubtotalDetalhe();
  renderAvaliacoesDetalhe(p);
  checarGatilhoAvaliacao(p.id);

  trocarAba("produto-detalhe");
}

function ajustarQtdDetalhe(delta) {
  if (!state.produtoDetalheAtivo) return;
  state.qtdDetalhe += delta;
  if (state.qtdDetalhe < 1) state.qtdDetalhe = 1;
  if (state.qtdDetalhe > (state.produtoDetalheAtivo.estoque || 1)) {
    state.qtdDetalhe = state.produtoDetalheAtivo.estoque;
    mostrarToast("Limite de estoque atingido!");
  }
  atualizarSubtotalDetalhe();
}

function atualizarSubtotalDetalhe() {
  if (!state.produtoDetalheAtivo) return;
  document.getElementById("detalhe-qtd-valor").innerText = state.qtdDetalhe;
  const sub = (state.produtoDetalheAtivo.preco || 0) * state.qtdDetalhe;
  document.getElementById("detalhe-btn-subtotal").innerText =
    `R$ ${sub.toFixed(2).replace(".", ",")}`;
}

function adicionarDetalheAoCarrinho() {
  if (!state.produtoDetalheAtivo || state.produtoDetalheAtivo.estoque <= 0) {
    alert("Produto esgotado!");
    return;
  }
  const p = state.produtoDetalheAtivo;
  const item = state.cart.find((i) => i.id === p.id);
  if (item) item.qtd += state.qtdDetalhe;
  else
    state.cart.push({
      id: p.id,
      nome: p.nome,
      preco: p.preco,
      img: p.img,
      qtd: state.qtdDetalhe,
    });
  atualizarBadgeCarrinho();
  mostrarToast(`🍔 ${state.qtdDetalhe}x "${p.nome}" adicionado!`);
  abrirCarrinho();
}

// ============================================================
// 3. AVALIAÇÕES (SÓ DESBLOQUEIA SE O ADMIN DER BAIXA COMO ENTREGUE)
// ============================================================
function checarGatilhoAvaliacao(prodId) {
  const box = document.getElementById("box-formulario-avaliacao");
  if (!state.clienteLogado) {
    box.innerHTML = `<p style="font-size:0.8rem; color:var(--text-muted);">🔒 Faça login para avaliar produtos.</p>`;
    return;
  }

  const pedidos = getPedidos();
  const comprouEEntregue = pedidos.some(
    (p) =>
      p.clienteId === state.clienteLogado.id &&
      p.status === "Entregue" &&
      p.itens &&
      p.itens.some((it) => it.produtoId === prodId),
  );

  if (comprouEEntregue) {
    box.innerHTML = `
                    <div style="color:var(--accent); font-weight:bold; font-size:0.85rem;">✅ Compra Entregue Confirmada! Avalie o produto:</div>
                    <select id="novo-rating" style="padding:6px; border-radius:6px; margin:6px 0;">
                        <option value="5">⭐⭐⭐⭐⭐ (5/5 Excelente)</option>
                        <option value="4">⭐⭐⭐⭐ (4/5 Muito Bom)</option>
                        <option value="3">⭐⭐⭐ (3/5 Regular)</option>
                    </select>
                    <textarea id="novo-comentario" placeholder="Deixe sua opinião..." style="width:100%; height:50px; padding:6px; border-radius:6px; border:1px solid var(--border); font-size:0.82rem;"></textarea>
                    <button class="btn-crud" style="margin-top:6px;" onclick="publicarAvaliacao(${prodId})">Publicar Avaliação</button>
                `;
  } else {
    box.innerHTML = `
                    <div style="color:var(--warning); font-weight:bold; font-size:0.85rem;">🔒 Avaliação Bloqueada:</div>
                    <p style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">Apenas clientes com pedidos <strong>Entregues pelo Administrador</strong> podem avaliar.</p>
                `;
  }
}

function publicarAvaliacao(prodId) {
  const texto = document.getElementById("novo-comentario").value.trim();
  const rating = parseInt(document.getElementById("novo-rating").value);
  if (!texto) return;

  const prods = getProdutos();
  const p = prods.find((i) => i.id === prodId);
  if (!p.avaliacoes) p.avaliacoes = [];
  p.avaliacoes.unshift({
    autor: state.clienteLogado.nome,
    rating: rating,
    texto: texto,
    data: new Date().toLocaleDateString("pt-BR"),
  });
  p.totalRatings = (p.totalRatings || 0) + 1;
  localStorage.setItem("db_produtos", JSON.stringify(prods));
  mostrarToast("⭐ Avaliação enviada com sucesso!");
  abrirDetalhe(prodId);
}

function renderAvaliacoesDetalhe(p) {
  const box = document.getElementById("detalhe-lista-avaliacoes");
  const avs = p.avaliacoes || [];
  if (avs.length === 0) {
    box.innerHTML =
      "<p style='color:#888; font-size:0.82rem;'>Ainda não há avaliações.</p>";
    return;
  }
  box.innerHTML = avs
    .map(
      (a) => `
                <div style="background:#f8fafc; padding:8px 12px; border-radius:6px; border-left:3px solid var(--warning);">
                    <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:0.82rem;"><span>${a.autor}</span><span style="color:var(--warning);">${"⭐".repeat(a.rating)}</span></div>
                    <p style="font-size:0.8rem; color:#334155; margin-top:2px;">${a.texto}</p>
                    <small style="color:#888; font-size:0.7rem;">${a.data}</small>
                </div>
            `,
    )
    .join("");
}

// ============================================================
// 4. CARRINHO & CHECKOUT
// ============================================================
function abrirCarrinho() {
  const box = document.getElementById("carrinho-itens-lista");
  if (state.cart.length === 0) {
    box.innerHTML =
      "<p style='text-align:center; padding:40px; color:#888;'>Carrinho vazio.</p>";
  } else {
    box.innerHTML = state.cart
      .map(
        (i) => `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border);">
                        <div><strong>${i.img || "📦"} ${i.nome}</strong><br><small>${i.qtd}x R$ ${(i.preco || 0).toFixed(2).replace(".", ",")}</small></div>
                        <div style="display:flex; gap:6px; align-items:center;">
                            <button onclick="alterarQtdCart(${i.id}, -1)" style="width:24px; height:24px; cursor:pointer;">-</button>
                            <span>${i.qtd}</span>
                            <button onclick="alterarQtdCart(${i.id}, 1)" style="width:24px; height:24px; cursor:pointer;">+</button>
                        </div>
                    </div>
                `,
      )
      .join("");
  }
  calcularTotaisCarrinho();
  document.getElementById("drawer-carrinho").classList.add("active");
}

function fecharCarrinho() {
  document.getElementById("drawer-carrinho").classList.remove("active");
}

function alterarQtdCart(id, delta) {
  const item = state.cart.find((i) => i.id === id);
  if (!item) return;
  item.qtd += delta;
  if (item.qtd <= 0) state.cart = state.cart.filter((i) => i.id !== id);
  abrirCarrinho();
  atualizarBadgeCarrinho();
}

function atualizarBadgeCarrinho() {
  document.getElementById("badge-cart-count").innerText = state.cart.reduce(
    (a, b) => a + b.qtd,
    0,
  );
}

function calcularTotaisCarrinho() {
  const sub = state.cart.reduce((a, b) => a + b.preco * b.qtd, 0);
  let desc = 0;
  if (state.cupomAplicado) {
    if (state.cupomAplicado.tipo === "pct")
      desc = sub * (state.cupomAplicado.valor / 100);
    if (state.cupomAplicado.tipo === "reais") desc = state.cupomAplicado.valor;
  }
  const total = Math.max(0, sub - desc + (state.cart.length > 0 ? 10 : 0));
  document.getElementById("resumo-subtotal").innerText =
    "R$ " + sub.toFixed(2).replace(".", ",");
  document.getElementById("resumo-total").innerText =
    "R$ " + total.toFixed(2).replace(".", ",");

  const lDesc = document.getElementById("linha-desconto");
  if (desc > 0) {
    lDesc.style.display = "flex";
    document.getElementById("resumo-desconto").innerText =
      "- R$ " + desc.toFixed(2).replace(".", ",");
  } else {
    lDesc.style.display = "none";
  }
  return { sub, desc, total };
}

function aplicarCupomCarrinho() {
  const cod = document.getElementById("input-cupom").value.trim().toUpperCase();
  const cupom = getCupons().find((c) => c.codigo === cod);
  const msg = document.getElementById("cupom-status-msg");
  const sub = state.cart.reduce((a, b) => a + b.preco * b.qtd, 0);

  if (
    !cupom ||
    !cupom.ativo ||
    new Date(cupom.expiraEm) < new Date() ||
    sub < cupom.minPedido
  ) {
    msg.innerText = "❌ Cupom inválido, expirado ou valor mínimo não atingido.";
    msg.style.color = "var(--danger)";
    state.cupomAplicado = null;
  } else {
    state.cupomAplicado = cupom;
    msg.innerText = `✅ Cupom ${cod} Ativado!`;
    msg.style.color = "var(--accent)";
    mostrarToast("Cupom aplicado!");
  }
  calcularTotaisCarrinho();
}

function copiarCupom(cod) {
  document.getElementById("input-cupom").value = cod;
  abrirCarrinho();
  aplicarCupomCarrinho();
}

function finalizarPedidoCliente() {
  if (state.cart.length === 0) return;
  if (!state.clienteLogado) {
    fecharCarrinho();
    abrirModalAuthCliente();
    alert("Identifique-se para fechar o pedido!");
    return;
  }

  const totais = calcularTotaisCarrinho();
  const pedidos = getPedidos();
  const prods = getProdutos();

  // Baixa no estoque
  state.cart.forEach((item) => {
    const p = prods.find((x) => x.id === item.id);
    if (p) p.estoque = Math.max(0, (p.estoque || 0) - item.qtd);
  });
  localStorage.setItem("db_produtos", JSON.stringify(prods));

  const novoPed = {
    id: 1000 + pedidos.length + 1,
    clienteId: state.clienteLogado.id,
    clienteNome: state.clienteLogado.nome,
    data: new Date().toISOString(),
    status: "Pendente",
    total: totais.total,
    itens: state.cart.map((i) => ({
      produtoId: i.id,
      nome: i.nome,
      qtd: i.qtd,
      precoUnit: i.preco,
      subtotalItem: i.preco * i.qtd,
    })),
  };

  pedidos.unshift(novoPed);
  localStorage.setItem("db_pedidos", JSON.stringify(pedidos));

  state.cart = [];
  state.cupomAplicado = null;
  atualizarBadgeCarrinho();
  fecharCarrinho();
  mostrarToast("🎉 Pedido Confirmado! O Admin dará baixa.");
  trocarAba("pedidos-cliente");
}

// ============================================================
// 5. BACK-OFFICE ADMINISTRADOR (DASHBOARD & CRUD COMPLETO)
// ============================================================
function renderAdminDashboard() {
  const pedidos = getPedidos();
  const clientes = getClientes();

  const faturamento = pedidos.reduce(
    (acc, p) => (p.status !== "Cancelado" ? acc + (p.total || 0) : acc),
    0,
  );
  const ticket = pedidos.length > 0 ? faturamento / pedidos.length : 0;

  document.getElementById("kpi-faturamento").innerText =
    `R$ ${faturamento.toFixed(2).replace(".", ",")}`;
  document.getElementById("kpi-total-pedidos").innerText = pedidos.length;
  document.getElementById("kpi-ticket-medio").innerText =
    `R$ ${ticket.toFixed(2).replace(".", ",")}`;
  document.getElementById("kpi-total-clientes").innerText = clientes.length;

  const counts = {
    Pendente: 0,
    "Em Preparo": 0,
    "Em Transporte": 0,
    Entregue: 0,
    Cancelado: 0,
  };
  pedidos.forEach((p) => {
    if (counts[p.status] !== undefined) counts[p.status]++;
  });

  document.getElementById("kpi-status-chips").innerHTML = Object.entries(counts)
    .map(
      ([st, qtd]) => `
                <span class="chip" style="background:#f1f5f9; color:#334155;"><strong>${st}:</strong> ${qtd}</span>
            `,
    )
    .join("");
}

function renderAdminPedidosTable() {
  const peds = getPedidos();
  document.getElementById("tbody-adm-pedidos").innerHTML = peds
    .map(
      (p) => `
                <tr>
                    <td><strong>#${p.id}</strong></td>
                    <td>${p.clienteNome}</td>
                    <td>${new Date(p.data).toLocaleDateString("pt-BR")}</td>
                    <td><strong>R$ ${(p.total || 0).toFixed(2).replace(".", ",")}</strong></td>
                    <td><span class="chip" style="background:#e0f2fe; color:#0369a1; font-weight:bold;">${p.status}</span></td>
                    <td>
                        <select class="select-status" onchange="alterarStatusPedidoAdmin(${p.id}, this.value)">
                            <option value="Pendente" ${p.status === "Pendente" ? "selected" : ""}>Pendente</option>
                            <option value="Em Preparo" ${p.status === "Em Preparo" ? "selected" : ""}>Em Preparo</option>
                            <option value="Em Transporte" ${p.status === "Em Transporte" ? "selected" : ""}>Em Transporte</option>
                            <option value="Entregue" ${p.status === "Entregue" ? "selected" : ""}>✅ Entregue (Permite Avaliação)</option>
                            <option value="Cancelado" ${p.status === "Cancelado" ? "selected" : ""}>❌ Cancelado</option>
                        </select>
                    </td>
                    <td><button class="btn-crud delete" onclick="excluirPedidoAdmin(${p.id})">Excluir</button></td>
                </tr>
            `,
    )
    .join("");
}

function alterarStatusPedidoAdmin(id, st) {
  const peds = getPedidos();
  const p = peds.find((x) => x.id === id);
  if (p) {
    p.status = st;
    localStorage.setItem("db_pedidos", JSON.stringify(peds));
    mostrarToast(`Status do Pedido #${id} atualizado para ${st}`);
    renderAdminDashboard();
    renderAdminPedidosTable();
  }
}

function excluirPedidoAdmin(id) {
  if (!confirm(`Excluir permanentemente o pedido #${id}?`)) return;
  const peds = getPedidos().filter((x) => x.id !== id);
  localStorage.setItem("db_pedidos", JSON.stringify(peds));
  renderAdminPedidosTable();
  renderAdminDashboard();
}

// Lançamento de Pedido Manual no Admin
function abrirModalPedidoManual() {
  const cliSelect = document.getElementById("ped-manual-cli");
  const prodSelect = document.getElementById("ped-manual-prod");

  cliSelect.innerHTML = getClientes()
    .map((c) => `<option value="${c.id}">${c.nome} (${c.email})</option>`)
    .join("");
  prodSelect.innerHTML = getProdutos()
    .map(
      (p) =>
        `<option value="${p.id}">${p.nome} - R$ ${p.preco.toFixed(2)} (Estq: ${p.estoque})</option>`,
    )
    .join("");

  document.getElementById("modal-crud-pedido-manual").classList.add("active");
}

function salvarPedidoManual() {
  const cliId = parseInt(document.getElementById("ped-manual-cli").value);
  const prodId = parseInt(document.getElementById("ped-manual-prod").value);
  const qtd = parseInt(document.getElementById("ped-manual-qtd").value) || 1;
  const status = document.getElementById("ped-manual-status").value;

  const cliente = getClientes().find((c) => c.id === cliId);
  const prods = getProdutos();
  const prod = prods.find((p) => p.id === prodId);

  if (!cliente || !prod) {
    alert("Selecione cliente e produto!");
    return;
  }

  prod.estoque = Math.max(0, (prod.estoque || 0) - qtd);
  localStorage.setItem("db_produtos", JSON.stringify(prods));

  const total = prod.preco * qtd;
  const pedidos = getPedidos();
  const novoPed = {
    id: 1000 + pedidos.length + 1,
    clienteId: cliente.id,
    clienteNome: cliente.nome,
    data: new Date().toISOString(),
    status: status,
    total: total,
    itens: [
      {
        produtoId: prod.id,
        nome: prod.nome,
        qtd: qtd,
        precoUnit: prod.preco,
        subtotalItem: total,
      },
    ],
  };

  pedidos.unshift(novoPed);
  localStorage.setItem("db_pedidos", JSON.stringify(pedidos));
  fecharModal("modal-crud-pedido-manual");
  mostrarToast("✅ Pedido manual inserido com sucesso!");
  renderAdminPedidosTable();
  renderAdminDashboard();
  renderCatalogo(getProdutos());
}

// CRUD Produtos
function renderAdminProdutosTable() {
  document.getElementById("tbody-adm-produtos").innerHTML = getProdutos()
    .map(
      (p) => `
                <tr>
                    <td>#${p.id}</td>
                    <td style="font-size:1.5rem;">${p.img || "📦"}</td>
                    <td><strong>${p.nome}</strong></td>
                    <td>${p.categoria}</td>
                    <td>R$ ${(p.preco || 0).toFixed(2).replace(".", ",")}</td>
                    <td><strong style="color:${p.estoque < 5 ? "red" : "green"};">${p.estoque || 0} un</strong></td>
                    <td>
                        <button class="btn-crud edit" onclick="editarProdutoModal(${p.id})">Editar</button>
                        <button class="btn-crud delete" onclick="excluirProdutoAdmin(${p.id})">Excluir</button>
                    </td>
                </tr>
            `,
    )
    .join("");
}

function abrirModalProduto() {
  document.getElementById("prod-id").value = "";
  document.getElementById("modal-prod-title").innerText = "Cadastrar Produto";
  document.getElementById("prod-nome").value = "";
  document.getElementById("prod-preco").value = "";
  document.getElementById("prod-est").value = "10";
  document.getElementById("prod-img").value = "📦";
  document.getElementById("prod-desc").value = "";
  document.getElementById("modal-crud-produto").classList.add("active");
}

function editarProdutoModal(id) {
  const p = getProdutos().find((x) => x.id === id);
  document.getElementById("prod-id").value = p.id;
  document.getElementById("modal-prod-title").innerText =
    "Editar Produto #" + p.id;
  document.getElementById("prod-nome").value = p.nome;
  document.getElementById("prod-cat").value = p.categoria;
  document.getElementById("prod-preco").value = p.preco;
  document.getElementById("prod-est").value = p.estoque;
  document.getElementById("prod-img").value = p.img || "📦";
  document.getElementById("prod-desc").value = p.descricao || "";
  document.getElementById("modal-crud-produto").classList.add("active");
}

function salvarProdutoCRUD() {
  const id = document.getElementById("prod-id").value;
  const prods = getProdutos();
  const nome = document.getElementById("prod-nome").value.trim();
  const preco = parseFloat(document.getElementById("prod-preco").value) || 0;
  const est = parseInt(document.getElementById("prod-est").value) || 0;

  if (!nome || preco <= 0) {
    alert("Preencha nome e preço!");
    return;
  }

  if (id) {
    const p = prods.find((x) => x.id == id);
    p.nome = nome;
    p.categoria = document.getElementById("prod-cat").value;
    p.preco = preco;
    p.estoque = est;
    p.img = document.getElementById("prod-img").value || "📦";
    p.descricao = document.getElementById("prod-desc").value;
    if (!p.avaliacoes) p.avaliacoes = [];
  } else {
    prods.push({
      id: 100 + prods.length + 1,
      nome: nome,
      categoria: document.getElementById("prod-cat").value,
      preco: preco,
      precoAntigo: preco * 1.2,
      estoque: est,
      img: document.getElementById("prod-img").value || "📦",
      rating: 5.0,
      totalRatings: 0,
      descricao: document.getElementById("prod-desc").value,
      avaliacoes: [],
    });
  }
  localStorage.setItem("db_produtos", JSON.stringify(prods));
  fecharModal("modal-crud-produto");
  mostrarToast("Produto salvo com sucesso!");
  renderAdminProdutosTable();
  renderCatalogo(getProdutos());
}

function excluirProdutoAdmin(id) {
  if (!confirm("Excluir este produto?")) return;
  localStorage.setItem(
    "db_produtos",
    JSON.stringify(getProdutos().filter((x) => x.id !== id)),
  );
  renderAdminProdutosTable();
  renderCatalogo(getProdutos());
}

// CRUD Clientes Manual
function renderAdminClientesTable() {
  document.getElementById("tbody-adm-clientes").innerHTML = getClientes()
    .map(
      (c) => `
                <tr>
                    <td>#${c.id}</td>
                    <td><strong>${c.nome}</strong></td>
                    <td>${c.email}</td>
                    <td>${c.cpf}</td>
                    <td>${c.cidade}</td>
                    <td>
                        <button class="btn-crud edit" onclick="editarClienteModal(${c.id})">Editar</button>
                        <button class="btn-crud delete" onclick="excluirClienteAdmin(${c.id})">Excluir</button>
                    </td>
                </tr>
            `,
    )
    .join("");
}

function abrirModalClienteManual() {
  document.getElementById("cli-adm-id").value = "";
  document.getElementById("modal-cli-title").innerText =
    "Cadastrar Novo Cliente";
  document.getElementById("cli-adm-nome").value = "";
  document.getElementById("cli-adm-email").value = "";
  document.getElementById("cli-adm-cpf").value = "";
  document.getElementById("cli-adm-tel").value = "";
  document.getElementById("cli-adm-end").value = "";
  document.getElementById("cli-adm-cid").value = "São Paulo - SP";
  document.getElementById("modal-crud-cliente").classList.add("active");
}

function editarClienteModal(id) {
  const c = getClientes().find((x) => x.id === id);
  document.getElementById("cli-adm-id").value = c.id;
  document.getElementById("modal-cli-title").innerText =
    "Editar Cliente #" + c.id;
  document.getElementById("cli-adm-nome").value = c.nome;
  document.getElementById("cli-adm-email").value = c.email;
  document.getElementById("cli-adm-cpf").value = c.cpf;
  document.getElementById("cli-adm-tel").value = c.telefone;
  document.getElementById("cli-adm-end").value = c.endereco;
  document.getElementById("cli-adm-cid").value = c.cidade;
  document.getElementById("modal-crud-cliente").classList.add("active");
}

function salvarClienteCRUD() {
  const id = document.getElementById("cli-adm-id").value;
  const clis = getClientes();
  const nome = document.getElementById("cli-adm-nome").value.trim();
  const email = document.getElementById("cli-adm-email").value.trim();

  if (!nome || !email) {
    alert("Preencha nome e e-mail!");
    return;
  }

  if (id) {
    const c = clis.find((x) => x.id == id);
    c.nome = nome;
    c.email = email;
    c.cpf = document.getElementById("cli-adm-cpf").value;
    c.telefone = document.getElementById("cli-adm-tel").value;
    c.endereco = document.getElementById("cli-adm-end").value;
    c.cidade = document.getElementById("cli-adm-cid").value;
  } else {
    clis.push({
      id: clis.length + 1,
      nome: nome,
      email: email,
      senha: "123",
      cpf: document.getElementById("cli-adm-cpf").value,
      telefone: document.getElementById("cli-adm-tel").value,
      endereco: document.getElementById("cli-adm-end").value,
      cidade: document.getElementById("cli-adm-cid").value,
    });
  }
  localStorage.setItem("db_clientes", JSON.stringify(clis));
  fecharModal("modal-crud-cliente");
  mostrarToast("Cliente salvo com sucesso!");
  renderAdminClientesTable();
  renderAdminDashboard();
}

function excluirClienteAdmin(id) {
  if (!confirm("Excluir este cliente?")) return;
  localStorage.setItem(
    "db_clientes",
    JSON.stringify(getClientes().filter((x) => x.id !== id)),
  );
  renderAdminClientesTable();
  renderAdminDashboard();
}

// CRUD Cupons
function renderAdminCuponsTable() {
  document.getElementById("tbody-adm-cupons").innerHTML = getCupons()
    .map(
      (c, idx) => `
                <tr>
                    <td><strong>${c.codigo}</strong></td>
                    <td>${c.tipo === "pct" ? c.valor + "%" : "R$ " + c.valor} OFF</td>
                    <td>R$ ${c.minPedido},00</td>
                    <td>${c.expiraEm}</td>
                    <td><span style="color:${c.ativo ? "green" : "red"}; font-weight:bold;">${c.ativo ? "Ativo" : "Inativo"}</span></td>
                    <td>
                        <button class="btn-crud edit" onclick="alternarCupom(${idx})">${c.ativo ? "Pausar" : "Ativar"}</button>
                        <button class="btn-crud delete" onclick="excluirCupom(${idx})">Excluir</button>
                    </td>
                </tr>
            `,
    )
    .join("");
}

function salvarNovoCupomAdmin() {
  const cod = document.getElementById("cupom-cod").value.trim().toUpperCase();
  const val = parseFloat(document.getElementById("cupom-val").value) || 0;
  const min = parseFloat(document.getElementById("cupom-min").value) || 0;
  const exp = document.getElementById("cupom-exp").value;
  const tipo = document.getElementById("cupom-tipo").value;

  if (!cod || val <= 0) return;
  const cups = getCupons();
  cups.push({
    codigo: cod,
    tipo: tipo,
    valor: val,
    minPedido: min,
    expiraEm: exp,
    ativo: true,
    desc: `${val}${tipo === "pct" ? "%" : "R$"} OFF`,
  });
  localStorage.setItem("db_cupons", JSON.stringify(cups));
  document.getElementById("cupom-cod").value = "";
  renderAdminCuponsTable();
  renderCatalogo(getProdutos());
  mostrarToast("Cupom cadastrado!");
}

function alternarCupom(idx) {
  const c = getCupons();
  c[idx].ativo = !c[idx].ativo;
  localStorage.setItem("db_cupons", JSON.stringify(c));
  renderAdminCuponsTable();
  renderCatalogo(getProdutos());
}
function excluirCupom(idx) {
  const c = getCupons();
  c.splice(idx, 1);
  localStorage.setItem("db_cupons", JSON.stringify(c));
  renderAdminCuponsTable();
  renderCatalogo(getProdutos());
}

// ============================================================
// 6. BACKUP JSON & CREDENCIAIS DO ADMIN
// ============================================================
function exportarBackupJSON() {
  const bkp = {
    produtos: getProdutos(),
    clientes: getClientes(),
    pedidos: getPedidos(),
    cupons: getCupons(),
    config: getConfig(),
  };
  const str = JSON.stringify(bkp, null, 2);
  document.getElementById("json-viewer").innerText = str;

  const blob = new Blob([str], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `backup-loja-express-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  mostrarToast("Backup exportado!");
}

function importarBackupJSON(e) {
  const file = e.target.files[0];
  if (!file) return;
  const r = new FileReader();
  r.onload = (ev) => {
    try {
      const d = JSON.parse(ev.target.result);
      if (d.produtos)
        localStorage.setItem("db_produtos", JSON.stringify(d.produtos));
      if (d.clientes)
        localStorage.setItem("db_clientes", JSON.stringify(d.clientes));
      if (d.pedidos)
        localStorage.setItem("db_pedidos", JSON.stringify(d.pedidos));
      if (d.cupons) localStorage.setItem("db_cupons", JSON.stringify(d.cupons));
      mostrarToast("Banco restaurado com sucesso!");
      renderCatalogo(getProdutos());
      renderAdminDashboard();
      renderAdminPedidosTable();
      renderAdminProdutosTable();
      renderAdminClientesTable();
      renderAdminCuponsTable();
    } catch (err) {
      alert("JSON inválido!");
    }
  };
  r.readAsText(file);
}

function salvarCredenciaisAdmin() {
  const email = document.getElementById("adm-cfg-email").value.trim();
  const senha = document.getElementById("adm-cfg-senha").value.trim();
  if (!email || !senha) {
    alert("Preencha e-mail e nova senha!");
    return;
  }
  localStorage.setItem(
    "db_config",
    JSON.stringify({ adminEmail: email, adminSenha: senha }),
  );
  mostrarToast("Senha do Administrador atualizada com sucesso!");
}

function resetarBancoFabrica() {
  if (!confirm("Restaurar dados iniciais de fábrica?")) return;
  localStorage.clear();
  initDatabase();
  mostrarToast("Dados de fábrica restaurados!");
  renderCatalogo(getProdutos());
  renderAdminDashboard();
  renderAdminPedidosTable();
  renderAdminProdutosTable();
  renderAdminClientesTable();
  renderAdminCuponsTable();
}

// ============================================================
// 7. AUTENTICAÇÃO E NAVEGAÇÃO
// ============================================================
function alternarVisao(v) {
  if (v === "admin" && !state.adminLogado) {
    document.getElementById("modal-login-admin").classList.add("active");
    return;
  }
  state.visao = v;
  document.getElementById("btn-role-cliente").className =
    "role-btn " + (v === "cliente" ? "active" : "");
  document.getElementById("btn-role-admin").className =
    "role-btn " + (v === "admin" ? "active admin" : "");
  document.getElementById("mobile-nav").style.display =
    v === "cliente" ? "flex" : "none";
  document.getElementById("btn-carrinho-header").style.display =
    v === "cliente" ? "flex" : "none";
  document.getElementById("btn-header-auth").style.display =
    v === "cliente" ? "flex" : "none";

  if (v === "admin") {
    trocarAba("admin");
    renderAdminDashboard();
    renderAdminPedidosTable();
    renderAdminProdutosTable();
    renderAdminClientesTable();
    renderAdminCuponsTable();
  } else {
    trocarAba("loja");
    renderCatalogo(getProdutos());
  }
}

function autenticarAdmin(e) {
  e.preventDefault();
  const em = document.getElementById("adm-login-email").value.trim();
  const ps = document.getElementById("adm-login-senha").value.trim();
  const cfg = getConfig();

  if (em === cfg.adminEmail && ps === cfg.adminSenha) {
    state.adminLogado = true;
    localStorage.setItem("sessao_admin", "true");
    fecharModal("modal-login-admin");
    alternarVisao("admin");
    mostrarToast("Acesso administrativo concedido!");
  } else {
    alert("Credenciais administrativas incorretas!");
  }
}

function logoutAdmin() {
  state.adminLogado = false;
  localStorage.removeItem("sessao_admin");
  alternarVisao("cliente");
  mostrarToast("Sessão administrativa encerrada.");
}

function abrirModalAuthCliente() {
  document.getElementById("modal-auth-cliente").classList.add("active");
}
function fecharModal(id) {
  document.getElementById(id).classList.remove("active");
}

function alternarAbaCliente(a) {
  document
    .querySelectorAll(".auth-tab-btn")
    .forEach((b) => b.classList.remove("active"));
  if (a === "login") {
    document.getElementById("tab-cli-login").classList.add("active");
    document.getElementById("form-cli-login").style.display = "block";
    document.getElementById("form-cli-cad").style.display = "none";
  } else {
    document.getElementById("tab-cli-cad").classList.add("active");
    document.getElementById("form-cli-login").style.display = "none";
    document.getElementById("form-cli-cad").style.display = "block";
  }
}

function loginCliente(e) {
  e.preventDefault();
  const em = document.getElementById("cli-log-email").value.trim();
  const ps = document.getElementById("cli-log-senha").value.trim();
  const cli = getClientes().find((c) => c.email === em && c.senha === ps);
  if (cli) {
    state.clienteLogado = cli;
    localStorage.setItem("sessao_cliente", JSON.stringify(cli));
    atualizarHeaderAuth();
    fecharModal("modal-auth-cliente");
    mostrarToast(`Bem-vindo(a), ${cli.nome.split(" ")[0]}!`);
  } else {
    alert("E-mail ou senha incorretos.");
  }
}

function cadastroCliente(e) {
  e.preventDefault();
  const clis = getClientes();
  const em = document.getElementById("cad-email").value.trim();
  if (clis.some((c) => c.email === em)) {
    alert("E-mail já cadastrado!");
    return;
  }

  const novo = {
    id: clis.length + 1,
    nome: document.getElementById("cad-nome").value.trim(),
    email: em,
    senha: document.getElementById("cad-senha").value.trim(),
    cpf: document.getElementById("cad-cpf").value.trim(),
    telefone: document.getElementById("cad-tel").value.trim(),
    endereco: document.getElementById("cad-end").value.trim(),
    cidade: document.getElementById("cad-cid").value.trim(),
  };
  clis.push(novo);
  localStorage.setItem("db_clientes", JSON.stringify(clis));
  state.clienteLogado = novo;
  localStorage.setItem("sessao_cliente", JSON.stringify(novo));
  atualizarHeaderAuth();
  fecharModal("modal-auth-cliente");
  mostrarToast("Conta criada com sucesso!");
}

function logoutCliente() {
  state.clienteLogado = null;
  localStorage.removeItem("sessao_cliente");
  atualizarHeaderAuth();
  trocarAba("loja");
  mostrarToast("Você saiu da conta.");
}

function atualizarHeaderAuth() {
  document.getElementById("lbl-cliente-logado").innerText = state.clienteLogado
    ? state.clienteLogado.nome.split(" ")[0]
    : "Entrar";
}

function trocarAba(a) {
  document
    .querySelectorAll(".view-section")
    .forEach((v) => v.classList.remove("active"));
  document
    .querySelectorAll(".nav-tab")
    .forEach((t) => t.classList.remove("active"));

  const target = document.getElementById("view-" + a);
  if (target) target.classList.add("active");

  const tabBtn = document.getElementById(
    "tab-btn-" + a.replace("-cliente", ""),
  );
  if (tabBtn) tabBtn.classList.add("active");

  if (a === "pedidos-cliente") renderPedidosCliente();
  if (a === "perfil-cliente") renderPerfilCliente();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function trocarSubAbaAdmin(sub, btn) {
  document
    .querySelectorAll(".admin-subview")
    .forEach((s) => s.classList.remove("active"));
  document
    .querySelectorAll(".admin-tab-btn")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById(sub).classList.add("active");
  btn.classList.add("active");
}

function renderPedidosCliente() {
  const box = document.getElementById("lista-pedidos-cliente");
  if (!state.clienteLogado) {
    box.innerHTML =
      "<p style='text-align:center; padding:40px; color:#888;'>Faça login para ver seus pedidos.</p>";
    return;
  }
  const peds = getPedidos().filter(
    (p) => p.clienteId === state.clienteLogado.id,
  );
  if (peds.length === 0) {
    box.innerHTML =
      "<p style='text-align:center; padding:40px; color:#888;'>Nenhum pedido realizado.</p>";
    return;
  }

  box.innerHTML = peds
    .map(
      (p) => `
                <div style="background:white; padding:16px; border-radius:12px; border:1px solid var(--border); margin-bottom:12px;">
                    <div style="display:flex; justify-content:space-between;"><strong>Pedido #${p.id}</strong><span class="chip" style="background:#e0f2fe; color:#0369a1; font-weight:bold;">${p.status}</span></div>
                    <small style="color:#888;">${new Date(p.data).toLocaleDateString("pt-BR")}</small>
                    <div style="margin:8px 0; font-size:0.85rem;">${p.itens ? p.itens.map((i) => `${i.qtd}x ${i.nome}`).join(", ") : ""}</div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong style="color:var(--primary);">Total: R$ ${(p.total || 0).toFixed(2).replace(".", ",")}</strong>
                        ${p.status === "Entregue" && p.itens && p.itens.length > 0 ? `<button class="btn-crud" onclick="abrirDetalhe(${p.itens[0].produtoId})">⭐ Avaliar</button>` : `<small style="color:#888;">Aguardando entrega do Admin</small>`}
                    </div>
                </div>
            `,
    )
    .join("");
}

function renderPerfilCliente() {
  const c = state.clienteLogado;
  const box = document.getElementById("dados-cliente-perfil");
  if (!c) {
    box.innerHTML = "<p>Nenhum cliente conectado.</p>";
    return;
  }
  box.innerHTML = `<p><strong>Nome:</strong> ${c.nome}</p><p><strong>E-mail:</strong> ${c.email}</p><p><strong>CPF:</strong> ${c.cpf}</p><p><strong>Telefone:</strong> ${c.telefone}</p><p><strong>Endereço:</strong> ${c.endereco} - ${c.cidade}</p>`;
}

function filtrarProdutos() {
  const t = document.getElementById("input-busca").value.toLowerCase();
  renderCatalogo(getProdutos().filter((p) => p.nome.toLowerCase().includes(t)));
}

function filtrarCategoria(c, btn) {
  document
    .querySelectorAll(".chip")
    .forEach((x) => x.classList.remove("active"));
  btn.classList.add("active");
  renderCatalogo(
    c === "todos"
      ? getProdutos()
      : getProdutos().filter((p) => p.categoria === c),
  );
}

function mostrarToast(m) {
  const t = document.getElementById("app-toast");
  t.innerText = m;
  t.style.display = "block";
  setTimeout(() => (t.style.display = "none"), 2500);
}

// Inicialização Garantida
window.addEventListener("DOMContentLoaded", () => {
  renderCatalogo(getProdutos());
  atualizarHeaderAuth();
  atualizarBadgeCarrinho();
});
