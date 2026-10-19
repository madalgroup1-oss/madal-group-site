// Carte Google Maps de /contact : l'iframe n'est créée qu'au clic sur « Afficher la carte »,
// pour ne charger aucun script ni cookie Google avant le choix du visiteur.

document.querySelectorAll<HTMLElement>('[data-carte]').forEach((zone) => {
  const bouton = zone.querySelector<HTMLButtonElement>('[data-carte-afficher]');
  const adresse = zone.dataset.carte;
  if (!bouton || !adresse) return;

  bouton.addEventListener('click', () => {
    const cadre = document.createElement('iframe');
    cadre.src = adresse;
    cadre.title = 'Carte : MADAL GROUP, Yopougon Camp Militaire – Abidjan';
    cadre.loading = 'lazy';
    cadre.referrerPolicy = 'no-referrer-when-downgrade';
    cadre.allowFullscreen = true;
    zone.append(cadre);
    zone.querySelector<HTMLElement>('.carte-plan__invite')?.setAttribute('hidden', '');
    cadre.focus();
  });
});
