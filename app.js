'use strict';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const escapeHtml = value => String(value).replace(/[&<>"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[character]);
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const money = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const menu = $('#mobile-menu');
const menuButton = $('.menu-toggle');
function closeMenu() {
  menu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
}
menuButton.addEventListener('click', () => {
  menu.hidden = !menu.hidden;
  menuButton.setAttribute('aria-expanded', String(!menu.hidden));
  menuButton.setAttribute('aria-label', menu.hidden ? 'Abrir menu' : 'Fechar menu');
});
menu.addEventListener('click', event => {
  if (event.target.closest('a,button')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !menu.hidden) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!menu.hidden && !event.target.closest('.site-header')) closeMenu();
});

let returnFocus = null;
$$('[data-open]').forEach(button => button.addEventListener('click', () => {
  returnFocus = button.closest('#mobile-menu') ? menuButton : button;
  closeMenu();
  const dialog = $('#' + button.dataset.open);
  dialog.showModal();
  window.dispatchEvent(new CustomEvent('donafresca:dialogopen', { detail: { dialog } }));
}));
$$('dialog').forEach(dialog => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (returnFocus && returnFocus.offsetParent) returnFocus.focus();
  });
});

const slides = [
  ['Quem entende de peixe, confia na gente.', 'Salmão, peixes de rio e mar, bacalhau e frutos do mar.', 'Consulte os produtos e confirme a disponibilidade direto com a equipe Donafresca.', 'assets/titles/hero-trust.png'],
  ['Cortes selecionados', 'Do peixe inteiro ao corte pronto para a receita.', 'Compare as opções do catálogo e fale com a equipe para escolher peso e preparo.', 'assets/titles/hero-cuts.png'],
  ['Sabor artesanal', 'Petiscos, caldos e pratos congelados para ter em casa.', 'Veja também os itens de mercearia para sushi, risotos, massas e outros preparos.', 'assets/titles/hero-flavor.png'],
];
let activeSlide = 0;
function changeSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  const slide = slides[activeSlide];
  $('#hero-title').textContent = slide[0];
  $('#hero-title-art').src = slide[3];
  $('#hero-description').innerHTML = `<strong>${escapeHtml(slide[1])}</strong> ${escapeHtml(slide[2])}`;
  $$('[data-slide]').forEach(button => {
    const active = Number(button.dataset.slide) === activeSlide;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  window.dispatchEvent(new CustomEvent('donafresca:slidechange', { detail: { index: activeSlide } }));
}
$$('[data-slide]').forEach(button => button.addEventListener('click', () => changeSlide(Number(button.dataset.slide))));
$('#hero-prev').onclick = () => changeSlide(activeSlide - 1);
$('#hero-next').onclick = () => changeSlide(activeSlide + 1);

const species = [
  ['Salmão chileno', 'Inteiro, em filés ou preparado para sashimi e ceviche.', 'Compare as opções com e sem pele e consulte o preço por quilo no catálogo.', 'assets/titles/selection-salmon.png'],
  ['Pintado pantaneiro', 'Pintado inteiro ou em postas para assar, fritar e preparar caldos.', 'O catálogo também reúne cortes de tambatinga, pirarucu, tilápia e outros peixes de água doce.', 'assets/titles/selection-pintado.png'],
  ['Robalo & pescada', 'Robalo inteiro e diferentes cortes de peixes do mar.', 'Encontre também atum, pargo, corvina, cação, merluza, sardinha, tainha e manjuba.', 'assets/titles/selection-robalo.png'],
  ['Tilápia Saint Peter', 'Filé congelado para o preparo do dia a dia.', 'Para uma opção pronta, consulte também o filé de tilápia à parmegiana na seção de rotisseria.', 'assets/titles/selection-tilapia.png'],
];
let activeSpecies = 0;
function changeSpecies(index) {
  activeSpecies = (index + species.length) % species.length;
  const item = species[activeSpecies];
  $('#species-title').textContent = 'Nossa seleção: ' + item[0];
  $('#species-title-art').src = item[3];
  $('#species-intro').innerHTML = `<strong>${escapeHtml(item[1])}</strong>`;
  $('#species-description').textContent = item[2];
  $$('[data-species]').forEach(button => {
    const active = Number(button.dataset.species) === activeSpecies;
    button.classList.toggle('selected', active);
    button.setAttribute('aria-pressed', String(active));
  });
  window.dispatchEvent(new CustomEvent('donafresca:specieschange', { detail: { index: activeSpecies } }));
}
$$('[data-species]').forEach(button => button.onclick = () => changeSpecies(Number(button.dataset.species)));
$('#species-prev').onclick = () => changeSpecies(activeSpecies - 1);
$('#species-next').onclick = () => changeSpecies(activeSpecies + 1);

const products = Array.isArray(window.DONAFRESCA_PRODUCTS) ? window.DONAFRESCA_PRODUCTS : [];
const quantities = products.map(() => 0);
let filter = 'all';
let visibleLimit = 12;

function filteredIndexes() {
  const query = normalize($('#search').value.trim());
  const matches = [];
  products.forEach((product, index) => {
    const inCategory = filter === 'all' || filter === product.category;
    const inSearch = normalize(`${product.name} ${product.categoryLabel}`).includes(query);
    if (inCategory && inSearch) matches.push(index);
  });
  return matches;
}

function productCard(product, index) {
  const unitLabel = product.unit === 'kg' ? 'Preço por kg' : 'Preço por unidade';
  const quantityLabel = product.unit === 'kg' ? 'kg' : 'un.';
  return `<article class="product" data-product="${index}">
    <div class="product-image"><img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" width="600" height="600" loading="lazy"></div>
    <div class="product-meta"><small>${escapeHtml(product.categoryLabel)}</small><span>${unitLabel}</span></div>
    <h3>${escapeHtml(product.name)}</h3>
    <div class="product-bottom"><span class="product-price">${money(product.price)}<small> / ${quantityLabel}</small></span><div class="quantity"><button data-minus="${index}" aria-label="Remover ${quantityLabel} de ${escapeHtml(product.name)}" ${quantities[index] === 0 ? 'disabled' : ''}>−</button><span id="quantity-${index}" aria-label="Quantidade de ${escapeHtml(product.name)}">${quantities[index]}</span><button data-plus="${index}" aria-label="Adicionar ${quantityLabel} de ${escapeHtml(product.name)}" ${quantities[index] === 99 ? 'disabled' : ''}>+</button></div></div>
  </article>`;
}

function renderProducts() {
  const matches = filteredIndexes();
  const visible = matches.slice(0, visibleLimit);
  $('#product-grid').innerHTML = visible.map(index => productCard(products[index], index)).join('');
  $('#empty').hidden = matches.length > 0;
  $('#load-more').hidden = visible.length >= matches.length;
  $('#catalog-count').textContent = `${matches.length} ${matches.length === 1 ? 'produto encontrado' : 'produtos encontrados'}${matches.length > visible.length ? ` · mostrando ${visible.length}` : ''}`;
  window.dispatchEvent(new CustomEvent('donafresca:productsrendered', { detail: { count: visible.length } }));
}

function updateOrder() {
  const count = quantities.reduce((sum, quantity) => sum + quantity, 0);
  const total = quantities.reduce((sum, quantity, index) => sum + quantity * products[index].price, 0);
  $('#order-status').textContent = count ? `${count} ${count === 1 ? 'item selecionado' : 'itens selecionados'} · ${money(total)}` : 'Selecione os produtos do seu pedido';
  $('#order-link').firstChild.textContent = count ? 'Consultar meu pedido ' : 'Consultar pelo WhatsApp ';
  const lines = products.map((product, index) => {
    if (!quantities[index]) return null;
    const unit = product.unit === 'kg' ? 'kg' : 'un.';
    return `${quantities[index]} ${unit} × ${product.name} — ${money(quantities[index] * product.price)}`;
  }).filter(Boolean);
  const message = count
    ? `Olá, Donafresca! Gostaria de consultar este pedido:\n\n${lines.join('\n')}\n\nTotal estimado: ${money(total)}. Pode confirmar disponibilidade, peso e valor?`
    : 'Olá, Donafresca! Gostaria de consultar os produtos disponíveis hoje.';
  $('#order-link').href = 'https://wa.me/5565992054009?text=' + encodeURIComponent(message);
}

$('#product-grid').addEventListener('click', event => {
  const button = event.target.closest('[data-plus],[data-minus]');
  if (!button) return;
  const index = Number(button.dataset.plus ?? button.dataset.minus);
  quantities[index] = Math.max(0, Math.min(99, quantities[index] + (button.hasAttribute('data-plus') ? 1 : -1)));
  $('#quantity-' + index).textContent = quantities[index];
  $(`[data-minus="${index}"]`).disabled = quantities[index] === 0;
  $(`[data-plus="${index}"]`).disabled = quantities[index] === 99;
  updateOrder();
});

$$('[data-filter]').forEach(button => button.onclick = () => {
  filter = button.dataset.filter;
  visibleLimit = 12;
  $$('[data-filter]').forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  renderProducts();
});
$('#search').addEventListener('input', () => {
  visibleLimit = 12;
  renderProducts();
});
$('#load-more').addEventListener('click', () => {
  visibleLimit += 12;
  renderProducts();
});

$('#year').textContent = new Date().getFullYear();
renderProducts();
updateOrder();
