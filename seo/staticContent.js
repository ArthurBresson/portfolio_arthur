// Plugin Vite : écrit le contenu du portfolio en HTML simple dans #root au
// moment du build. Les robots qui n'exécutent pas le JavaScript lisent ainsi
// le nom, la présentation, les projets et le parcours. Au chargement, React
// remplace ce bloc par le vrai site. Tout vient de src/data/portfolio.js.
import {
  profil,
  parcours,
  projets,
  savoirEtre,
} from "../src/data/portfolio.js";

const escape = (text) =>
  String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const plain = (text) => escape(text.replaceAll("*", ""));

const byStartDesc = (a, b) => b.start.localeCompare(a.start);

function render() {
  const projetsReels = projets
    .filter((projet) => !projet.placeholder)
    .toSorted(byStartDesc);
  const etapes = parcours.toSorted(byStartDesc);

  const liens = [
    `<a href="mailto:${escape(profil.email)}">${escape(profil.email)}</a>`,
    ...profil.socials.map(
      (social) => `<a href="${escape(social.url)}">${escape(social.label)}</a>`,
    ),
  ].join(" · ");

  return `
      <div class="seo-static">
        <header>
          <h1>${escape(profil.nom)}</h1>
          <p>${plain(profil.accroche)}</p>
        </header>
        <main>
          <section>
            <h2>À propos</h2>
            ${profil.presentation.map((p) => `<p>${escape(p)}</p>`).join("\n            ")}
          </section>
          <section>
            <h2>Projets</h2>
            <ul>
              ${projetsReels
                .map(
                  (projet) =>
                    `<li><h3>${escape(projet.title)}</h3><p>${escape(projet.pitch)}</p>${
                      projet.stack?.length
                        ? `<p>${escape(projet.stack.join(", "))}</p>`
                        : ""
                    }</li>`,
                )
                .join("\n              ")}
            </ul>
          </section>
          <section>
            <h2>Parcours</h2>
            <ul>
              ${etapes
                .map(
                  (etape) =>
                    `<li><h3>${escape(etape.title)}, ${escape(etape.place)}</h3><p>${escape(etape.detail)}</p></li>`,
                )
                .join("\n              ")}
            </ul>
          </section>
          <section>
            <h2>Savoir-être</h2>
            <ul>
              ${savoirEtre.map((item) => `<li><strong>${escape(item.titre)}</strong> : ${escape(item.preuve)}</li>`).join("\n              ")}
            </ul>
          </section>
        </main>
        <footer>
          <h2>Contact</h2>
          <p>${liens}</p>
        </footer>
      </div>
    `;
}

export default function staticContent() {
  return {
    name: "seo-static-content",
    apply: "build",
    transformIndexHtml(html) {
      return html.replace(
        '<div id="root"></div>',
        `<div id="root">${render()}</div>`,
      );
    },
  };
}
