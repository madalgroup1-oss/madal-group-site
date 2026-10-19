// Images de /admin : redimensionnement dans le navigateur (1 600 px de côté au plus)
// puis téléversement dans le bucket public « media ».

import { supabase } from './client';

const COTE_MAX = 1600;
const TYPES_ACCEPTES = ['image/jpeg', 'image/png', 'image/webp'];

function chargerImage(fichier: File): Promise<HTMLImageElement> {
  return new Promise((resoudre, rejeter) => {
    const lecteur = new FileReader();
    lecteur.onerror = () => rejeter(new Error('Lecture du fichier impossible.'));
    lecteur.onload = () => {
      const image = new Image();
      image.onload = () => resoudre(image);
      image.onerror = () => rejeter(new Error('Ce fichier n’est pas une image lisible.'));
      image.src = String(lecteur.result);
    };
    lecteur.readAsDataURL(fichier);
  });
}

function versBlob(toile: HTMLCanvasElement, type: string, qualite: number): Promise<Blob | null> {
  return new Promise((resoudre) => toile.toBlob(resoudre, type, qualite));
}

/** Image réduite à 1 600 px, en WebP (ou JPEG / PNG si le navigateur ne sait pas produire du WebP). */
async function redimensionner(fichier: File): Promise<{ blob: Blob; extension: string }> {
  const image = await chargerImage(fichier);
  const echelle = Math.min(1, COTE_MAX / Math.max(image.naturalWidth, image.naturalHeight));
  const toile = document.createElement('canvas');
  toile.width = Math.round(image.naturalWidth * echelle);
  toile.height = Math.round(image.naturalHeight * echelle);
  const contexte = toile.getContext('2d');
  if (!contexte) throw new Error('Redimensionnement impossible sur ce navigateur.');
  contexte.drawImage(image, 0, 0, toile.width, toile.height);

  const webp = await versBlob(toile, 'image/webp', 0.85);
  if (webp && webp.type === 'image/webp') return { blob: webp, extension: 'webp' };
  // Repli : PNG pour garder la transparence (logos), JPEG sinon
  const repli = fichier.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const blob = await versBlob(toile, repli, 0.85);
  if (!blob) throw new Error('Conversion de l’image impossible.');
  return { blob, extension: repli === 'image/png' ? 'png' : 'jpg' };
}

/**
 * Redimensionne puis téléverse une image dans « media/<dossier>/ ».
 * Renvoie le chemin enregistré dans la base (ex. « produits/lapin-frais-k3x9.webp »).
 */
export async function televerserImage(fichier: File, dossier: string, nom: string): Promise<string> {
  if (!TYPES_ACCEPTES.includes(fichier.type)) {
    throw new Error('Formats acceptés : JPG, PNG ou WebP.');
  }
  if (fichier.size > 20 * 1024 * 1024) {
    throw new Error('Image trop lourde (20 Mo maximum avant réduction).');
  }
  const { blob, extension } = await redimensionner(fichier);
  const suffixe = Math.random().toString(36).slice(2, 6);
  const chemin = `${dossier}/${nom || 'image'}-${suffixe}.${extension}`;
  const { error } = await supabase.storage
    .from('media')
    .upload(chemin, blob, { contentType: blob.type, cacheControl: '31536000', upsert: false });
  if (error) throw new Error(`Envoi de l’image impossible : ${error.message}`);
  return chemin;
}

/** Supprime des images devenues inutiles (une erreur n'interrompt pas l'enregistrement). */
export async function supprimerImages(chemins: string[]): Promise<void> {
  const aSupprimer = chemins.filter((chemin) => chemin !== '');
  if (aSupprimer.length === 0) return;
  const { error } = await supabase.storage.from('media').remove(aSupprimer);
  if (error) console.warn('Suppression d’images impossible :', error.message);
}
