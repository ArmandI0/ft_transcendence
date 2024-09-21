async function loadPage(page, div) {
    // Retirer les feuilles de style spécifiques précédentes des css de page sauf le css global
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
  
    try
    {
      const response = await fetch(`pages/${page}.html`);
      if (!response.ok)
      {
        throw new Error('Network response was not ok');
      }
      const html = await response.text();
      const container = document.getElementById(div);
      if (container) {
        container.innerHTML = html;
      }
    }
    catch (error)
    {
      console.error('Error fetching the section:', error);
    }
  }

document.addEventListener('DOMContentLoaded', async() => {
    const app = document.getElementById('app');
  
    // Initial page load
    loadPage('home', 'app');
  
    // Simple routing
    window.addEventListener('popstate', () => {
      const path = window.location.pathname.substring(1);
      loadPage(path || 'home', 'app');
    });
  
    document.body.addEventListener('click', async(event) => {
      if (event.target.matches('a')) {
        event.preventDefault();
        const href = event.target.getAttribute('href');
        const div = event.target.getAttribute('div');
        // console.log(div);
        window.history.pushState(null, '', href.substring(1));
        // console.log("href = " + href);
        // console.log("href.sub = " + href.substring(1));
        await loadPage(href.substring(1), div);
      }
    });
  });