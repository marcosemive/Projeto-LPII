# Changelog - Receitoteca Migration & Fixes

## Resumo Geral
Migração do projeto Receitoteca para Tailwind CSS com integração de correções de backend (chef_nome display, Content-Type validation) e ajustes de layout/scroll para garantir funcionalidade completa da aplicação.

---

## Mudanças por Arquivo

### Backend - TypeScript/Node.js

#### `src/middlewares/contentType.ts`
- **Alteração**: Expandir validação de Content-Type
- **Antes**: Validava apenas `application/json`
- **Depois**: Aceita tanto `application/json` quanto `multipart/form-data`
- **Motivo**: Permitir upload de imagens com multer (form-data) sem quebrar requisições JSON
- **Código**: `if (!req.is('application/json') && !req.is('multipart/form-data'))`

#### `src/models/receita.ts`
- **Alteração**: Incluir chef_nome em todas as queries de receita
- **Antes**: SELECT queries sem JOIN com chef table
- **Depois**: Todos os SELECTs fazem `JOIN chef c ON r.chef_id = c.id` e retornam `c.nome AS chef_nome`
- **Motivo**: Backend deve enviar chef_nome para frontend exibir corretamente em cards e modals
- **Campos adicionados**: `chef_nome` em todas as responses de receita

#### `src/routes/receita.ts`
- **Verificação**: Rota `/chef/minhas` está corretamente em `/receitas/chef/minhas` (com autenticarChef)
- **Status**: Sem alterações necessárias, estava correto

#### `package.json` - Scripts
- **Adição de scripts**:
  - `"css:build": "node build-css.js"` - Compilar Tailwind
  - `"css:watch": "node build-css.js --watch"` - Compilar em tempo real
  - `"build": "tsc && npm run css:build"` - Build completo com TypeScript + CSS

### Frontend - JavaScript/HTML/CSS

#### `public/js/api.js`
- **Alteração**: Corrigir endpoint para receitas do chef
- **Antes**: `fetch('/chef/minhas', ...)`
- **Depois**: `fetch('${BASE_URL}/receitas/chef/minhas', ...)`
- **Função afetada**: `getReceitasDoChef()`
- **Motivo**: Endpoint completo com /api prefix

#### `public/js/modules/ui.js`
- **Adição 1**: Função `normalizarTag(nome)`
  - Converte tag names para CSS-safe class names
  - Remove acentos, espaços, caracteres especiais
  - Exemplo: "Sem Glúten" → "sem-gluten"
- **Adição 2**: Chef name display em cards e modals
  - Código: `const chefName = r.chef_nome || r.chef?.nome || 'Receita de Chef'`
  - Fallback em caso de chef_nome não estar presente
- **Adição 3**: Tag normalization em renderização
  - Cards: `class="tag ${normalizarTag(e.nome)}"`
  - Modals: Aplicação similar para modal tags
- **Adição 4**: Auto-refresh de favoritos
  - `atualizarFavoritosVisiveis()` após like/unlike

#### `public/js/modules/chef.js`
- **Remoção**: Função `abrirFormEditar()` (redundante)
- **Simplificação**: Items de receita agora clicáveis diretamente
  - Código: `item.onclick = () => editarReceita(r.id)`
  - Removeu botão "Editar" redundante

#### `public/js/main.js`
- **Remoção**: Import de `abrirFormEditar`
- **Remoção**: Event handler para botão de editar (agora inline no item)

#### `public/js/modules/navegacao.js`
- **Verificação**: Show/hide de sections funcionando corretamente
- **Status**: Sem alterações, estrutura mantida

### CSS - Estrutura e Layout

#### `public/css/layout.css` (CRÍTICO - RESTAURADO)
- **Alteração 1**: `.page-wrapper` positioning
  - Antes (quebrado): `position: absolute; top: 88px; overflow-y: auto;`
  - Depois (restaurado): `position: relative; padding-top: calc(88px + 36px);`
  - **Motivo**: Absolute positioning quebrava scroll e alinhamento
- **Alteração 2**: Global html/body overflow
  - Antes (quebrado): `overflow: hidden` (travava scroll)
  - Depois (restaurado): `overflow-x: hidden; overscroll-behavior-y: contain;`
  - **Motivo**: Permitir scroll natural da página
- **Estrutura mantida**:
  - Fixed header de 88px (72px mobile)
  - Z-index hierarchy (0=bg, 5=header, 10=content)
  - Flex layout para centralização
- **Media queries**: Ajustadas para 720px breakpoint

#### `public/css/pages/home.css`
- **Adição**: Tag colors com `!important` override
  - `.tag.salgada`: #d4a017 (gold/brown)
  - `.tag.doce`: #ff8abf (pink)
  - `.tag.vegana`: #2a9d8f (green)
  - `.tag.low-carb`: #5a8f29 (olive)
  - `.tag.sem-gluten`: #8d6748 (brown)
  - `.tag.sem-lactose`: #6f8e8d (teal)
  - `.tag.vegetariana`: #4fa07a (green)
  - `.tag.sem-acucar`: #f7d794 (light yellow)
  - `.tag.light`: #f9f7e8 (off-white)
  - E demais cores com `!important`
- **Motivo**: Garantir override do .tag base style (red default)
- **Recipe card h3**: `font-weight: 700` (bold titles)

#### `public/css/components/cards.css`
- **Verificação**: card2 styling mantém `width: 680px; max-width: 100%; padding: 44px;`
- **h1 em cards**: `font-weight: 700` (bold headings)
- **Status**: Sem alterações necessárias

#### `public/css/components/modals.css`
- **Modal h3**: `font-weight: 700` (bold headings)
- **Close button**: `background: rgba(0, 0, 0, 0.45); color: #fff;`
- **Tag styling em modal**: `.modal-hero .tag` sem background para deixar classes individuais funcionarem
- **Status**: Estrutura mantida

#### `public/css/components/forms.css`
- **Status**: Sem alterações necessárias, estilos funcionam com layout restaurado

#### `public/css/reset.css`
- **Status**: Sem alterações necessárias

### Tailwind CSS Integration (Arquivos Novos)

#### `tailwind.config.js` (CRIADO)
```javascript
module.exports = {
  content: ["./public/**/*.html", "./public/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        'primary': '#e70731',
        'primary-dark': '#c9061f'
      }
    }
  },
  plugins: [],
  corePlugins: { preflight: true }
}
```
- **Propósito**: Configurar Tailwind para projeto Receitoteca
- **Content paths**: Monitorar HTML e JS para classes usadas
- **Cores customizadas**: primary (vermelho projeto)

#### `postcss.config.js` (CRIADO)
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```
- **Propósito**: Configurar PostCSS para processar Tailwind

#### `public/css/tailwind.css` (CRIADO)
- **Importações Tailwind**: @tailwind base, components, utilities
- **Variáveis CSS customizadas**: --color-primary, --color-primary-dark
- **Componentes customizados com @layer components**:
  - `.btn`: Styling Tailwind para botões
  - `.top-bar`: Header fixo
  - `.page-wrapper`: Layout principal
  - `input/select/textarea`: Estilos de formulário
  - `.bg-img`: Imagem de fundo

#### `build-css.js` (CRIADO)
```javascript
// Script Node.js que compila Tailwind usando PostCSS
// Input: public/css/tailwind.css
// Output: public/css/main.css
// Usa tailwindcss e autoprefixer plugins
```
- **Propósito**: Build customizado para compilar Tailwind sem complexidade de CLI
- **Vantagem**: Mantém estrutura simples em `public/css/`

### HTML Files

#### `public/login.html`
- **Alteração**: Texto do botão
  - Antes: "Entrar >"
  - Depois: "Entrar"
- **Estrutura mantida**: Usa `.page-wrapper` e `card2` CSS classes

#### `public/cadastro.html`
- **Alteração**: Texto do botão
  - Antes: "Cadastrar >"
  - Depois: "Cadastrar"
- **Estrutura mantida**: Usa `.page-wrapper` e `card2` CSS classes

#### `public/paginainicial.html`
- **Estrutura mantida**: Hero, receitas grid, favoritos, chef-area, modals
- **Comportamento afetado por layout.css**: Agora com scroll restaurado e sem overscroll

---

## Resumo de Mudanças por Categoria

### Funcionalidades Adicionadas/Corrigidas:
✅ **Chef Name Display**: Backend envia chef_nome, frontend normaliza e exibe em cards/modals
✅ **Content-Type Validation**: Middleware aceita multipart/form-data para uploads
✅ **Tag Color System**: CSS classes dinâmicas com !important override
✅ **Layout Restaurado**: Position relative + padding em vez de absolute
✅ **Page Scroll**: Restaurado - página initial scrollable sem lock
✅ **Recipe Edit**: Click direto em item para editar (sem botão redundante)
✅ **Tailwind Integration**: Configuração completa com build script

### Bugs Corrigidos:
🔧 **Login/Cadastro Card Alignment**: Restaurado alinhamento proporcional
🔧 **Page Scroll Lock**: Desbloqueado scroll da página
🔧 **Chef Recipe Endpoint**: Corrigido path completo com /api prefix
🔧 **Image Upload**: Content-Type middleware aceita form-data
🔧 **Tag Colors Not Showing**: !important CSS rules garantem exibição

### Testes Validados:
✓ JS syntax validation (ui.js, chef.js, etc.)
✓ TypeScript compilation (tsc --noEmit)
✓ Backend build (npm run build)
✓ CSS compilation (tailwindcss processing)
✓ No console errors expected

---

## Como Usar

### Compilar projeto completo:
```bash
npm run build
```

### Apenas compilar CSS:
```bash
npm run css:build
```

### Desenvolvimento (watch Tailwind):
```bash
npm run css:watch
```

### Iniciar servidor:
```bash
npm run start
```

---

## Status Final

**Backend**: ✅ Funcionando
- TypeScript compila sem erros
- Middleware aceita multipart/form-data
- Models retornam chef_nome em todas queries

**Frontend**: ✅ Funcionando
- JS valida sem erros de sintaxe
- API endpoints corretos com /api prefix
- Tag colors exibem com classes CSS dinâmicas
- Chef names aparecem em cards e modals

**Layout**: ✅ Restaurado
- Login/cadastro card alinhado corretamente
- Página inicial com scroll livre
- Sem overflow behavior issues
- Sem conteúdo sobre header

**CSS**: ✅ Integrado
- Tailwind configurado e compilando
- Cores customizadas adicionadas
- Componentes com @layer definidos
- Build script funciona via Node.js

---

## Notas Importantes

1. **Arquivo `.gitignore`**: Adicionar `dist/` e `public/css/main.css` (compilado)
2. **public/css/main.css**: Gerado automaticamente, não comitar
3. **Estrutura CSS**: Mantida em `public/css/` conforme solicitado
4. **Compatibilidade**: Tailwind CDN não está sendo usado, usando build local
5. **Fallbacks**: Chef name tem fallback em caso de campo não estar presente

