import { getReceita, favoritarReceita, desfavoritarReceita, getFavoritos } from '../api.js';

function normalizarTag(nome) {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

export function renderizarCards(receitas, grid = null) {
  const container = grid || document.querySelector('#receitas .recipes-grid');
  if (!container) return;

  container.innerHTML = '';

  if (receitas.length === 0) {
    container.innerHTML = '<p style="color:#888; padding: 16px;">Nenhuma receita encontrada.</p>';
    return;
  }

  function normalizarTag(nome) {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  }

  receitas.forEach(r => {
    const card = document.createElement('article');
    card.className = 'recipe-card';
    card.setAttribute('onclick', `abrirReceita(${r.id})`);

    // Suporte a múltiplas etiquetas
    const etiquetas = r.etiquetas || [];
    const tagsHTML = etiquetas
      .map(e => `<span class="tag ${normalizarTag(e.nome)}">${e.nome}</span>`)
      .join('');

    const primeiroIngrediente = r.ingredients[0] || 'Receita deliciosa';
    const chefName = r.chef_nome || r.chef?.nome || 'Receita de Chef';

    card.innerHTML = `
      <div class="recipe-image">
        <img src="${r.img}" alt="${r.title}">
        <div class="tags-container">${tagsHTML}</div>
      </div>
      <div class="recipe-content">
        <h3>${r.title}</h3>
        <p class="description">${primeiroIngrediente}...</p>
        <div class="recipe-meta">
          <span class="comments">(0 comentários)</span>
          <span class="chef">Chef: ${chefName}</span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

export function initBusca() {
  const searchInput = document.querySelector('.search');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const termo = this.value.toLowerCase();
      const cards = document.querySelectorAll('#receitas .recipe-card');
      cards.forEach(card => {
        const titulo = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = titulo.includes(termo) ? 'block' : 'none';
      });
    });
  }
}

export async function abrirReceita(id) {
  const r = await getReceita(id);
  if (!r) return;

  const tipo = localStorage.getItem('tipo');
  const token = localStorage.getItem('token');

  document.getElementById('modal-img').src = r.img;
  document.getElementById('modal-title').innerText = r.title;
  document.getElementById('modal-time').innerText = `⏱ ${r.time}`;
  document.getElementById('modal-servings').innerText = `👥 ${r.servings}`;
  const modalChefName = r.chef_nome || r.chef?.nome || '';
  document.getElementById('modal-author').innerText = `👨‍🍳 ${modalChefName}`;

  // Renderiza múltiplas etiquetas no modal
  const modalTagContainer = document.getElementById('modal-tags');
  if (modalTagContainer) {
    const etiquetas = r.etiquetas || [];
    modalTagContainer.innerHTML = etiquetas
      .map(e => `<span class="tag ${normalizarTag(e.nome)}">${e.nome}</span>`)
      .join('');
  }

  const btnFav = document.getElementById('modal-fav');
  if (btnFav) {
    if (tipo === 'usuario' && token) {
      btnFav.style.display = 'inline';
      btnFav.dataset.id = id;

      try {
        const favoritos = await getFavoritos();
        const jaSalvo = favoritos.some(f => f.id === id);
        btnFav.innerText = jaSalvo ? '❤️' : '🤍';
        btnFav.dataset.favoritado = jaSalvo ? 'true' : 'false';
      } catch {
        btnFav.innerText = '🤍';
        btnFav.dataset.favoritado = 'false';
      }
    } else {
      btnFav.style.display = 'none';
    }
  }

  const ing = document.getElementById('modal-ingredients');
  ing.innerHTML = '';
  r.ingredients.forEach(i => ing.innerHTML += `<li>${i}</li>`);

  const steps = document.getElementById('modal-steps');
  steps.innerHTML = '';
  r.steps.forEach(s => steps.innerHTML += `<li>${s}</li>`);

  document.getElementById('overlay').classList.add('active');
}

export function fecharReceita() {
  document.getElementById('overlay').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
  const btnFav = document.getElementById('modal-fav');
  if (btnFav) {
    btnFav.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = Number(btnFav.dataset.id);
      const jaSalvo = btnFav.dataset.favoritado === 'true';

      try {
        if (jaSalvo) {
          await desfavoritarReceita(id);
          btnFav.innerText = '🤍';
          btnFav.dataset.favoritado = 'false';
        } else {
          await favoritarReceita(id);
          btnFav.innerText = '❤️';
          btnFav.dataset.favoritado = 'true';
        }

        await atualizarFavoritosVisiveis();
      } catch (err) {
        alert(err.message);
      }
    });
  }
});

async function atualizarFavoritosVisiveis() {
  const favoritosArea = document.getElementById('favoritos-area');
  const favoritosGrid = document.getElementById('favoritos-grid');
  if (!favoritosArea || favoritosArea.style.display === 'none' || !favoritosGrid) return;

  try {
    const receitas = await getFavoritos();
    if (receitas.length === 0) {
      favoritosGrid.innerHTML = '<p style="color:#888; padding: 16px;">Nenhuma receita favorita ainda.</p>';
    } else {
      renderizarCards(receitas, favoritosGrid);
    }
  } catch {
    favoritosGrid.innerHTML = '<p style="color:#888; padding: 16px;">Nenhuma receita favorita ainda.</p>';
  }
}

window.abrirReceita = abrirReceita;
window.fecharReceita = fecharReceita;