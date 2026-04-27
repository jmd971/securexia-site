# SECUREXIA — Site Web

## Contexte du projet

SECUREXIA est un service managé de conformité ERP (Établissements Recevant du Public) basé à Les Abymes (Guadeloupe). Co-fondé par Jean-Marc (plateforme et relation client) et un associé consultant (visites terrain).

**Le site marketing** présente l'offre et génère des demandes d'Audit Flash via un formulaire GoHighLevel intégré.

---

## Informations légales

- **Raison sociale :** SECUREXIA
- **Adresse :** Rue Gutenberg Johannes, 97139 Les Abymes, Guadeloupe
- **SIRET :** 102 185 519 00018 — SIREN : 102 185 519
- **Email :** contact@securexia.fr
- **Téléphone :** +590 690 447 360
- **Site :** https://www.securexia.fr

---

## Architecture du site

Le site est une **SPA (Single Page Application) statique** sans framework. Toutes les pages sont dans `index.html` avec navigation JS.

```
securexia-site/
├── index.html        ← Structure HTML + head SEO + toutes les pages
├── style.css         ← Design system tokenisé + tous les composants
├── script.js         ← Routing URL, menu mobile, email, GHL, scroll reveals
├── vercel.json       ← Config Vercel (headers CSP, SPA rewrites, cache)
├── .gitignore        ← OS / éditeurs / .vercel / .env
└── CLAUDE.md         ← Ce fichier
```

## Stack et bibliothèques

- **Pas de framework** — HTML/CSS/JS vanilla, SPA mono-fichier
- **Google Fonts** : Syne (display) + DM Sans (body), preconnect dans le head
- **Vercel Analytics + Speed Insights** : snippets dans le head, données accessibles via le dashboard Vercel
- **GoHighLevel** : iframe pour le formulaire Audit Flash (page `/audit-flash`)
- **IntersectionObserver** : animations scroll-reveal légères (`.reveal` + `.reveal-delay-N`)

### Pages disponibles (id des divs)

| ID | URL logique | Contenu |
|---|---|---|
| `page-home` | / | Homepage — hero, problème, bento, tunnel, compare, principes, ressources, CTA |
| `page-collectivites` | /collectivites | Page dédiée DST/élus |
| `page-etablissements` | /etablissements | Établissements privés |
| `page-programme` | /programme-commerce | Mairies & commerçants (B2B2B) |
| `page-audit` | /audit-flash | Formulaire GHL + bénéfices |
| `page-service` | /service | Notre service vs SaaS |
| `page-ressources` | /ressources | Index articles / analyses |
| `page-article-avis` | /ressources/avis-defavorable-commission | Article — Avis défavorable 48h |
| `page-article-audit-7` | /ressources/audit-erp-7-points | Article — 7 points commission |
| `page-article-categories` | /ressources/categories-erp | Article — Catégories ERP |
| `page-apropos` | /a-propos | Équipe, vision, valeurs |
| `page-cgv` | /cgv | Conditions générales de vente |
| `page-mentions` | /mentions-legales | Mentions légales |
| `page-confidentialite` | /confidentialite | Politique de confidentialité |
| `page-404` | (fallback) | 404 — toute URL inconnue |

### Routing URL

`script.js` synchronise URL ↔ page via `history.pushState` :
- Au chargement, `window.location.pathname` est résolu en `pageId` via la map `routes`
- Toute route inconnue → `page-404` automatiquement
- `popstate` (back/forward) restaure la bonne page sans rescroll
- `vercel.json` `rewrites` envoie toute URL sans extension vers `index.html`, donc les deeplinks fonctionnent (ex: `/ressources/audit-erp-7-points`)

---

## Palette de couleurs

```css
--navy-dark:  #0F2347   /* Fond sombre header/hero */
--navy:       #1B3A6B   /* Couleur principale */
--navy-light: #2C5282   /* Variante claire */
--accent:     #E8401C   /* Rouge-orange — CTA, XIA du logo */
--off-white:  #F7F6F2   /* Fond sections alternées */
--gray-50:    #F5F4F0
--gray-100:   #E8E7E2   /* Bordures */
--gray-300:   #BEBCB4
--gray-500:   #7A7870   /* Texte secondaire */
--gray-700:   #3D3C38   /* Texte tertiaire */
--text:       #1A1917   /* Texte principal */
```

---

## Typographies

- **Display / titres :** `Syne` (Google Fonts) — poids 700/800
- **Corps / UI :** `DM Sans` (Google Fonts) — poids 300/400/500

---

## Logo SECUREXIA

Le logo est un SVG inline (bouclier + wordmark) :

```html
<!-- Fond sombre (header) -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="28" height="34">
  <polygon points="12,6 88,6 94,26 94,58 50,114 6,58 6,26" fill="#FFFFFF"/>
  <rect x="32" y="36" width="36" height="14" rx="2" fill="#E8401C"/>
  <rect x="32" y="6" width="36" height="12" rx="0" fill="#E8401C"/>
</svg>
<span>SECURE<span style="color:#E8401C;">XIA</span></span>

<!-- Fond clair (footer, documents) -->
<!-- Même SVG mais fill="#1B3A6B" -->
```

---

## Intégration GoHighLevel

Le formulaire Audit Flash est un iframe GHL :

```html
<iframe
  src="https://link.siboard-consulting.fr/widget/form/dvoliZE6EHT4LZDt7J2R?notrack=true"
  style="width:100%;min-height:680px;border:none;display:block;"
  id="ghl-audit-flash-form"
  title="Formulaire Audit Flash SECUREXIA"
  loading="lazy"
  allow="payment"
></iframe>
```

---

## Email — Anti-obfuscation Cloudflare

**PROBLÈME CRITIQUE :** Cloudflare obfusque automatiquement toute adresse email visible dans le HTML lorsque le domaine est proxifié derrière Cloudflare (cas rencontré historiquement).

**SOLUTION OBLIGATOIRE** — Ne jamais écrire `contact@securexia.fr` en clair dans le HTML.
Toujours utiliser la technique de concaténation JS :

```html
<!-- Lien email cliquable -->
<a href="#" onclick="window.location.href='mai'+'lto:'+'contact'+'@'+'securexia.fr';return false;">
  contact@securexia.fr
</a>

<!-- Ou avec data-email pour activation automatique -->
<a href="#" data-email="true">contact@securexia.fr</a>
```

```javascript
// Dans script.js — activé au DOMContentLoaded
function openEmail() {
  window.location.href = 'mai' + 'lto:' + 'contact' + '@' + 'securexia.fr';
}
```

**Ne jamais utiliser `href="mailto:contact@securexia.fr"` directement dans le HTML.**

---

## DNS Vercel

```
A     @    76.76.21.21
CNAME www  cname.vercel-dns.com
```

HTTPS géré automatiquement par Vercel (Let's Encrypt).
La config technique vit dans `vercel.json` : headers de sécurité, CSP (autorise GHL + Google Fonts), SPA rewrites (toute route sans extension → `index.html`).

---

## Structure du tunnel commercial

```
1. Audit Flash (gratuit)   → Reconnaissance terrain, identification risques
2. Devis personnalisé      → Basé sur grille de coefficients par catégorie ERP
3. Forfait annuel          → Service managé tout inclus
```

**Score de préparation 0-5** : calculé automatiquement depuis les checklist terrain.
- 0 = Non évalué
- 1 = Situation critique (point rédhibitoire)
- 2 = Lacunes sérieuses
- 3 = Situation correcte
- 4 = Quasi-prêt
- 5 = Commission-ready

---

## Offres (sans prix — sur devis après Audit Flash)

**Collectivités :**
- COMMUNE (jusqu'à 5 ERP)
- INTERCOMMUNALITÉ (6 à 20 ERP)
- TERRITOIRE (21 à 50 ERP)
- MÉTROPOLE (50+ ERP — sur devis)

**Établissements privés :**
- ESSENTIEL (1 ERP)
- PRO (1 ERP — suivi complet)
- RÉSEAU (multi-sites — sur devis)

---

## Règles d'édition importantes

1. **Nom de la société** : toujours SECUREXIA (pas SECURIXIA — ancienne erreur)
2. **Domaine** : securexia.fr (pas securixia.fr)
3. **Email** : contact@securexia.fr — jamais en clair dans le HTML (voir anti-obfuscation)
4. **Prix** : ne jamais afficher de prix sur le site — tout est "sur devis après Audit Flash"
5. **Score** : ne pas parler d'algorithme dans les pages commerciales — juste "tableau de bord"
6. **Audit Flash** : gratuit, sans engagement, ne produit PAS de score (juste des constats)

---

## Tâches typiques pour Claude Code

### Ajouter une page
```javascript
// 1. Ajouter le div dans index.html
<div id="page-nouvelle" class="page">
  ...contenu...
</div>

// 2. Ajouter le lien dans la nav
<button class="nav-link" onclick="showPage('nouvelle')">Nom page</button>

// 3. Ajouter dans le footer
<a onclick="showPage('nouvelle')">Nom page</a>
```

### Modifier le hero homepage
```html
<!-- Dans page-home, section.hero -->
<h1>Nouveau titre</h1>
<p class="hero-sub">Nouveau sous-titre</p>
```

### Changer une couleur
```css
/* Dans style.css */
:root {
  --accent: #NOUVELLE_COULEUR;
}
```

---

## Déploiement Vercel

**Vercel CLI** (recommandé pour les itérations) :
```bash
npm install -g vercel
vercel login
cd securexia-site
vercel               # preview deploy (branche)
vercel --prod        # production
```

**Git connect** (recommandé long terme) : connecter le repo à Vercel,
chaque push sur `main` déclenche un déploiement production, chaque PR
crée une preview URL.

**Migration depuis Netlify** :
1. Déployer une première fois sur Vercel pour obtenir l'URL preview
2. Vérifier que le site, le formulaire GHL et les liens email fonctionnent
3. Pointer le DNS vers Vercel (voir section DNS ci-dessus)
4. Désactiver le site Netlify une fois la propagation DNS confirmée

---

## Points de vigilance récurrents

| Problème | Cause | Solution |
|---|---|---|
| `showPage is not defined` | Script perdu en fin de fichier | Vérifier que script.js est chargé avant `</body>` |
| Email "protégé" sur Netlify | Cloudflare obfuscation | Utiliser onclick concaténation (voir section email) |
| Logo affiche SECURIXIA | Split HTML `SECURI` + `XIA` | Vérifier `SECURE<span>XIA</span>` pas `SECURI<span>XIA</span>` |
| Site tronqué après modif Python | Buffer write incomplet | Toujours vérifier `</html>` en fin de fichier |
