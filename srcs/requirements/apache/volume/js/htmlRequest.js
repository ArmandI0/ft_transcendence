async function loadPage(page, div) {
  const existingStyles = document.querySelectorAll('link[data-page]');
  existingStyles.forEach(link => link.remove());

  // Ajouter une feuille de style spécifique à la page, si nécessaire
  if (page) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `css/${page}.css`; // CSS spécifique à la page
      link.dataset.page = page;
      document.head.appendChild(link);
  }

  try {
      const response = await fetch(`pages/${page}.html`);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const html = await response.text();
      const container = document.getElementById(div);
      
      if (container) {
          container.innerHTML = html;
      } else {
          console.error(`Le conteneur ${div} n'existe pas`);
      }
      
      // Charger le script spécifique à la page après le contenu HTML
      await loadScript(page);
  } catch (error) {
      console.error('Error fetching the section:', error);
      const container = document.getElementById(div);
      if (container) {
          container.innerHTML = '<div>Error loading page. Please try again.</div>';
      }
  }
}

// Fonction pour charger un script spécifique
async function loadScript(page) {
  const scriptId = `script-${page}`;
  let existingScript = document.getElementById(scriptId);

  if (existingScript) {
    existingScript.remove();
    }

  // Créer un élément script
  const script = document.createElement('script');
  script.src = `js/${page}.js`; // Chemin vers le script spécifique à la page
  script.id = scriptId;
  script.async = true;

  // Attendre que le script soit chargé
  return new Promise((resolve) => {
      script.onload = () => {
          console.log(`Script ${page}.js chargé avec succès.`);
          resolve(); // Résoudre la promesse si le script est chargé
      };
      script.onerror = () => {
          console.warn(`Le script ${page}.js n'a pas pu être chargé. Aucune erreur retournée.`); 
          resolve(); // Résoudre la promesse même en cas d'erreur
      };
      document.body.appendChild(script);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const app = document.getElementById('app');

  // Chargement initial de la page
  loadPage('home', 'app');

  // Gestion simple du routage
  window.addEventListener('popstate', (event) => {
    const path = window.location.pathname.substring(1) || 'home';
    const divToReplace = event.state || 'app';
    loadPage(path, divToReplace);
});

  let currentPage = 'home';
  document.body.addEventListener('click', async (event) => {
      if (event.target.matches('a')) {
          event.preventDefault();
          const href = event.target.getAttribute('href');
          console.log(href);
          const div = event.target.getAttribute('div');
          console.log(div);
        //   if (href.substring(1) === currentPage)
        //     return;
          currentPage = href.substring(1); // Met à jour la page actuelle

          window.history.pushState(div, '', href.substring(1));
          await loadPage(href.substring(1), div);
      }
  });
});