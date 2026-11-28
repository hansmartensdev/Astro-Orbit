/**
 * French: the theme's own words. A copy of en.ts, translated; see that file
 * for what each line is. A non-breaking space (\u00a0) goes before : ; ! ?
 * as French typography wants.
 */
import type { Dictionary } from './en';

/** "de" becomes "d'" before a vowel: d'Alex Morgan, de Jean Dupont. */
const de = (name: string) => (/^[aeiouyàâéèêëîïôû]/i.test(name) ? `d'${name}` : `de ${name}`);

const fr: Dictionary = {
  name: 'Français',

  nav: {
    home: 'Accueil',
    about: 'À propos',
    projects: 'Projets',
    blog: 'Blog',
    contact: 'Contact',
    main: 'Principal',
    menu: 'Menu',
    close: 'Fermer',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    homeLabel: 'Accueil',
    skip: 'Aller au contenu',
    backToTop: 'Retour en haut',
    toLight: 'Passer en mode clair',
    toDark: 'Passer en mode sombre',
    breadcrumb: "Fil d'Ariane",
  },

  footer: {
    label: 'Pied de page',
    menu: 'Menu',
    social: 'Réseaux',
    sayHi: 'Dites bonjour',
    privacy: 'Confidentialité',
    home: (mark: string, name: string) => `${mark} ${name}, accueil`,
    rss: (name: string) => `Flux RSS ${de(name)}`,
  },

  home: {
    scroll: 'Défiler',
    allPosts: 'Tous les articles',
  },

  hero: {
    about: 'À propos',
    contact: 'Contact',
    projects: 'Projets',
    blog: 'Blog',
    aboutFacts: 'En bref',
    contactFacts: 'Autres façons de me joindre',
    projectFacts: 'Le projet en bref',
    projectsFacts: 'Les projets',
    blogFacts: 'Le blog en bref',
    postFacts: "À propos de l'article",
  },

  blog: {
    title: 'Blog',
    readPost: "Lire l'article",
    related: 'Articles similaires',
    back: 'Retour au blog',
    minRead: (n: number) => `${n}\u00a0min de lecture`,
    writtenBy: 'Écrit par',
    published: 'Publié',
    updated: 'Mis à jour',
    readingTime: 'Temps de lecture',
    category: 'Catégorie',
    posts: 'Articles',
    categories: 'Catégories',
    latest: 'Le plus récent',
    follow: 'Suivre',
    rssFeed: 'Flux RSS',
    all: 'Tous',
    filter: 'Filtrer par catégorie',
    search: 'Rechercher',
    searchLabel: 'Rechercher dans le blog',
    noMatches: 'Aucun résultat.',
    untitled: 'Sans titre',
    nothingYet: "Rien n'a encore été publié.",
    toc: 'Sur cette page',
    tocToggle: 'Table des matières',
    show: 'Afficher',
    hide: 'Masquer',
    share: 'Partager\u00a0:',
    copyLink: 'Copier le lien',
    copied: 'Lien copié',
    shareOn: (network: string) => `Partager sur ${network}`,
  },

  projects: {
    title: 'Projets',
    view: 'Voir le projet',
    next: 'Projet suivant',
    seeAll: (n: number) => `Voir les ${n} projets`,
    seeProject: (title: string) => `Voir le projet\u00a0: ${title}`,
    details: 'Le projet en bref',
    client: 'Client',
    year: 'Année',
    discipline: 'Discipline',
    services: 'Services',
    why: "Pourquoi je l'ai fait",
    what: "Ce que j'ai fait",
    stack: 'Technologies',
    shipped: 'Livré',
    visit: 'Visiter le site',
    github: 'Voir sur GitHub',
  },

  contact: {
    title: 'Contact',
    label: 'Envoyer un message',
    email: 'E-mail',
    whatsapp: 'WhatsApp',
    whatsappValue: 'Envoyer un message',
    basedIn: 'Basé à',
    name: 'Votre nom',
    emailAddress: 'Adresse e-mail',
    subject: 'Objet',
    message: 'Message',
    placeholder: 'Votre idée, votre question, ou simplement un bonjour.',
    send: 'Envoyer le message',
    sending: 'Envoi en cours…',
    sent: 'Message envoyé. Je vous répondrai par e-mail.',
    error: 'Une erreur est survenue',
    failed: "Échec de l'envoi du message. Veuillez réessayer plus tard.",
    nameShort: 'Le nom doit contenir au moins 2\u00a0caractères',
    messageShort: 'Le message doit contenir au moins 10\u00a0caractères',
    unexpected: 'Une erreur inattendue est survenue',
  },

  newsletter: {
    email: 'Adresse e-mail',
    placeholder: 'vous@exemple.fr',
    subscribe: "M'abonner",
    sending: 'Envoi…',
    sent: "Presque fini\u00a0: vérifiez votre boîte de réception et cliquez sur le lien de l'e-mail pour confirmer.",
    failed: 'Une erreur est survenue. Veuillez réessayer plus tard.',
    note: 'Vous pouvez vous désabonner à tout moment.',
    privacy: 'Confidentialité',
    confirmTitle: 'Confirmez votre abonnement',
    confirmText: 'Cliquez sur le bouton pour confirmer que vous souhaitez recevoir les nouveaux articles par e-mail.',
    confirm: 'Confirmer',
    confirming: 'Confirmation…',
    done: 'Abonnement confirmé',
    doneText: 'Merci. Vous recevrez un e-mail à chaque nouvel article.',
    expired:
      "Ce lien a expiré ou n'est pas valide. Abonnez-vous à nouveau sous n'importe quel article pour recevoir un nouveau lien.",
    back: 'Vers le blog',
    metaDescription: 'Confirmez votre abonnement aux nouveaux articles par e-mail.',
    invalid: 'Veuillez saisir une adresse e-mail valide',
    mailSubject: (site: string) => `Confirmez votre abonnement à ${site}`,
    mailIntro: (site: string) =>
      `Veuillez confirmer que vous souhaitez recevoir un e-mail ${de(site)} à chaque nouvel article.`,
    mailButton: 'Confirmer mon abonnement',
    mailIgnore: "Vous n'avez rien demandé\u00a0? Ignorez cet e-mail\u00a0: votre adresse ne sera pas ajoutée.",
  },

  notFound: {
    title: 'Page introuvable',
    description: "Cette page a été déplacée, supprimée ou n'a jamais existé.",
    lead: 'Rien',
    leadAccent: 'ici.',
    text: "La page que vous cherchez a été déplacée, supprimée ou n'a jamais existé.",
    home: "Retour à l'accueil",
    projects: 'Voir mes projets',
  },

  privacy: {
    title: 'Confidentialité',
    description:
      "Ce que ce site fait de vos données personnelles\u00a0: le formulaire de contact, l'hébergement et vos droits selon le RGPD.",
    blurb: 'Ce que ce site fait de vos données personnelles, et les droits que vous donne le RGPD.',
    updated: (date: string) => `Dernière mise à jour\u00a0: ${date}`,
  },

  ui: {
    a11y: {
      togglePassword: 'Afficher ou masquer le mot de passe',
      loading: 'Chargement',
      close: 'Fermer',
      dismiss: 'Ignorer',
      previous: 'Précédent',
      next: 'Suivant',
      error: 'Erreur',
      slideLabel: '{n} sur {total}',
      slideStatus: 'Diapositive {n} sur {total}',
      goToSlide: 'Aller à la diapositive {n}',
      slides: 'Diapositives',
      carousel: 'carrousel',
      slide: 'diapositive',
    },
    media: {
      photo: 'Photo',
      placeholder: 'Emplacement pour image\u00a0: {name}',
      play: 'Lire la vidéo\u00a0: {title}',
      playsFrom: 'Lecture depuis {provider}',
    },
  },
};

export default fr;
