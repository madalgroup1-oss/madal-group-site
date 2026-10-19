// Formulaire de demande (src/components/FormulaireDemande.astro) : contrôle des champs
// dans le navigateur, envoi à l'Edge Function submit-demande, états envoi / succès / erreur.
// Les mêmes règles sont revérifiées côté serveur.

const POLES = ['consulting', 'distribution', 'technologie', 'groupe'];
const TAILLE_MAX = 5 * 1024 * 1024;
const EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'docx'];
const MOTIF_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Champ = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function longueur(valeur: string): number {
  return Array.from(valeur.trim()).length;
}

/** Téléphone ivoirien : 10 chiffres, indicatif +225 ou 00225 accepté. */
function telephoneValide(saisie: string): boolean {
  let chiffres = saisie.replace(/[\s.\-()]/g, '');
  if (chiffres.startsWith('+225')) chiffres = chiffres.slice(4);
  else if (chiffres.startsWith('00225')) chiffres = chiffres.slice(5);
  return /^\d{10}$/.test(chiffres);
}

/** Message d'erreur du champ, ou chaîne vide s'il est valide. */
function verifierChamp(champ: Champ): string {
  const valeur = champ.value;
  switch (champ.name) {
    case 'nom':
      return longueur(valeur) >= 2 && longueur(valeur) <= 100
        ? ''
        : 'Indiquez votre nom ou celui de votre entreprise (2 à 100 caractères).';
    case 'telephone':
      return telephoneValide(valeur) ? '' : 'Indiquez un numéro ivoirien à 10 chiffres (ex. 07 87 45 76 18).';
    case 'email':
      return valeur.trim() === '' || MOTIF_EMAIL.test(valeur.trim()) ? '' : 'Adresse email invalide.';
    case 'pole':
      return POLES.includes(valeur) ? '' : 'Choisissez le département concerné.';
    case 'objet':
      return longueur(valeur) >= 3 && longueur(valeur) <= 150
        ? ''
        : "Indiquez l'objet de votre demande (3 à 150 caractères).";
    case 'description':
      return longueur(valeur) >= 20 && longueur(valeur) <= 2000
        ? ''
        : 'Décrivez votre besoin (20 à 2 000 caractères).';
    case 'consentement':
      return (champ as HTMLInputElement).checked ? '' : 'Votre accord est nécessaire pour traiter la demande.';
    case 'piece_jointe': {
      const fichier = (champ as HTMLInputElement).files?.[0];
      if (!fichier) return '';
      const extension = fichier.name.split('.').pop()?.toLowerCase() ?? '';
      if (!EXTENSIONS.includes(extension)) return 'Formats acceptés : PDF, JPG, PNG, DOCX.';
      if (fichier.size > TAILLE_MAX) return 'Le fichier dépasse 5 Mo.';
      return '';
    }
    default:
      return '';
  }
}

function initialiserFormulaire(zone: HTMLElement): void {
  const formulaire = zone.querySelector<HTMLFormElement>('[data-formulaire]');
  const confirmation = zone.querySelector<HTMLElement>('[data-confirmation]');
  const alerte = zone.querySelector<HTMLElement>('[data-alerte]');
  const envoi = zone.querySelector<HTMLButtonElement>('[data-envoi]');
  const libelleEnvoi = zone.querySelector<HTMLElement>('[data-envoi-libelle]');
  const compteur = zone.querySelector<HTMLElement>('[data-compteur]');
  if (!formulaire || !confirmation || !alerte || !envoi || !libelleEnvoi) return;

  const libelleInitial = libelleEnvoi.textContent ?? '';
  const champs = Array.from(
    formulaire.querySelectorAll<Champ>('input[name]:not([type="hidden"]), select[name], textarea[name]'),
  ).filter((champ) => champ.name !== 'site_web');
  let enCours = false;

  // Pré-remplissage depuis l'adresse sur /devis, ex. /devis?pole=technologie&objet=Démonstration
  if (formulaire.dataset.lireAdresse !== undefined) {
    const parametres = new URLSearchParams(window.location.search);
    const pole = parametres.get('pole') ?? '';
    const objet = parametres.get('objet') ?? '';
    const liste = formulaire.elements.namedItem('pole');
    const champObjet = formulaire.elements.namedItem('objet');
    if (liste instanceof HTMLSelectElement && POLES.includes(pole)) liste.value = pole;
    if (champObjet instanceof HTMLInputElement && objet !== '') champObjet.value = objet.slice(0, 150);
  }

  function afficherErreur(nom: string, message: string): void {
    const champ = champs.find((element) => element.name === nom);
    const zoneErreur = formulaire?.querySelector<HTMLElement>(`[data-erreur="${nom}"]`);
    if (zoneErreur) zoneErreur.textContent = message;
    if (champ) {
      if (message === '') champ.removeAttribute('aria-invalid');
      else champ.setAttribute('aria-invalid', 'true');
    }
  }

  function afficherAlerte(message: string): void {
    if (!alerte) return;
    alerte.textContent = message;
    alerte.hidden = message === '';
  }

  function etatEnvoi(actif: boolean): void {
    enCours = actif;
    if (!envoi || !libelleEnvoi) return;
    envoi.setAttribute('aria-disabled', String(actif));
    libelleEnvoi.textContent = actif ? 'Envoi en cours…' : libelleInitial;
  }

  function majCompteur(): void {
    const description = formulaire?.elements.namedItem('description');
    if (!compteur || !(description instanceof HTMLTextAreaElement)) return;
    const nombre = longueur(description.value);
    compteur.textContent =
      nombre === 0 ? '20 caractères minimum, 2 000 maximum.' : `${nombre} / 2 000 caractères (20 minimum).`;
  }

  // Une erreur affichée se met à jour pendant la saisie ; un champ quitté est vérifié
  champs.forEach((champ) => {
    const evenement = champ instanceof HTMLInputElement && (champ.type === 'checkbox' || champ.type === 'file')
      ? 'change'
      : 'input';
    champ.addEventListener(evenement, () => {
      if (champ.getAttribute('aria-invalid') === 'true' || evenement === 'change') {
        afficherErreur(champ.name, verifierChamp(champ));
      }
      if (champ.name === 'description') majCompteur();
    });
    champ.addEventListener('blur', () => {
      if (champ.value !== '' && !(champ instanceof HTMLInputElement && champ.type === 'checkbox')) {
        afficherErreur(champ.name, verifierChamp(champ));
      }
    });
  });

  formulaire.addEventListener('submit', async (evenement) => {
    evenement.preventDefault();
    if (enCours) return;
    afficherAlerte('');

    let premierInvalide: Champ | null = null;
    champs.forEach((champ) => {
      const message = verifierChamp(champ);
      afficherErreur(champ.name, message);
      if (message !== '' && premierInvalide === null) premierInvalide = champ;
    });
    if (premierInvalide !== null) {
      (premierInvalide as Champ).focus();
      return;
    }

    etatEnvoi(true);
    try {
      const reponse = await fetch(formulaire.action, { method: 'POST', body: new FormData(formulaire) });
      const resultat = (await reponse.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        erreurs?: Record<string, string>;
      };

      if (reponse.ok && resultat.ok === true) {
        formulaire.hidden = true;
        confirmation.hidden = false;
        confirmation.focus();
        confirmation.scrollIntoView({ block: 'center' });
        return;
      }

      if (resultat.erreurs) {
        Object.entries(resultat.erreurs).forEach(([nom, message]) => afficherErreur(nom, message));
        const premier = champs.find((champ) => resultat.erreurs?.[champ.name] !== undefined);
        premier?.focus();
      }
      afficherAlerte(resultat.message ?? "L'envoi a échoué. Réessayez, ou appelez-nous au 07 87 45 76 18.");
    } catch {
      afficherAlerte(
        "Connexion impossible. Vérifiez votre connexion Internet, ou appelez-nous au 07 87 45 76 18.",
      );
    } finally {
      etatEnvoi(false);
    }
  });

  zone.querySelector<HTMLButtonElement>('[data-nouvelle]')?.addEventListener('click', () => {
    formulaire.reset();
    champs.forEach((champ) => afficherErreur(champ.name, ''));
    majCompteur();
    confirmation.hidden = true;
    formulaire.hidden = false;
    champs[0]?.focus();
  });
}

document.querySelectorAll<HTMLElement>('[data-demande]').forEach(initialiserFormulaire);
