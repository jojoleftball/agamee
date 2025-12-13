export type Language = 'en' | 'it' | 'el' | 'es';

export interface Translations {
  common: {
    loading: string;
    continue: string;
    back: string;
    close: string;
    save: string;
    cancel: string;
    enter: string;
    locked: string;
    settings: string;
    play: string;
  };
  loading: {
    title: string;
    subtitle: string;
    tip: string;
  };
  dialogue: {
    tap_continue: string;
  };
  intro: {
    maria_line1: string;
    soly_line1: string;
    maria_line2: string;
    soly_line2: string;
    maria_line3: string;
  };
  map: {
    main_garden: string;
    zen_garden: string;
    tropical_garden: string;
    desert_garden: string;
    winter_garden: string;
    coming_soon: string;
  };
  settings: {
    title: string;
    sound: string;
    music: string;
    volume: string;
    mute: string;
    connect_account: string;
    google: string;
    apple: string;
    email: string;
    version: string;
    language: string;
    select_language: string;
    connected: string;
    not_connected: string;
  };
  languages: {
    english: string;
    italian: string;
    greek: string;
    spanish: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      loading: 'Loading',
      continue: 'Continue',
      back: 'Back',
      close: 'Close',
      save: 'Save',
      cancel: 'Cancel',
      enter: 'Enter',
      locked: 'Locked',
      settings: 'Settings',
      play: 'Play',
    },
    loading: {
      title: 'Merge Garden',
      subtitle: 'Restore Your Dream Garden',
      tip: 'Preparing the seeds...',
    },
    dialogue: {
      tap_continue: 'Tap to continue',
    },
    intro: {
      maria_line1: "Oh wow... look at this old garden! It must have been so beautiful once.",
      soly_line1: "I can see the potential! With some love and care, we can restore it to its former glory!",
      maria_line2: "You're right, Soly! Look at all these overgrown plants. They just need a little attention.",
      soly_line2: "Let's start by clearing the center garden first. Once we polish it up, we can work on the others!",
      maria_line3: "That's a great plan! I can't wait to see this garden bloom again!",
    },
    map: {
      main_garden: 'Main Garden',
      zen_garden: 'Zen Garden',
      tropical_garden: 'Tropical Paradise',
      desert_garden: 'Desert Oasis',
      winter_garden: 'Winter Wonderland',
      coming_soon: 'Coming Soon',
    },
    settings: {
      title: 'Settings',
      sound: 'Sound Effects',
      music: 'Background Music',
      volume: 'Volume',
      mute: 'Mute',
      connect_account: 'Connect Account',
      google: 'Google',
      apple: 'Apple',
      email: 'Email',
      version: 'Version',
      language: 'Language',
      select_language: 'Select Language',
      connected: 'Connected',
      not_connected: 'Not Connected',
    },
    languages: {
      english: 'English',
      italian: 'Italian',
      greek: 'Greek',
      spanish: 'Spanish',
    },
  },
  it: {
    common: {
      loading: 'Caricamento',
      continue: 'Continua',
      back: 'Indietro',
      close: 'Chiudi',
      save: 'Salva',
      cancel: 'Annulla',
      enter: 'Entra',
      locked: 'Bloccato',
      settings: 'Impostazioni',
      play: 'Gioca',
    },
    loading: {
      title: 'Merge Garden',
      subtitle: 'Ripristina il Tuo Giardino dei Sogni',
      tip: 'Preparando i semi...',
    },
    dialogue: {
      tap_continue: 'Tocca per continuare',
    },
    intro: {
      maria_line1: "Oh wow... guarda questo vecchio giardino! Doveva essere così bello una volta.",
      soly_line1: "Vedo il potenziale! Con un po' di amore e cura, possiamo riportarlo al suo antico splendore!",
      maria_line2: "Hai ragione, Soly! Guarda tutte queste piante cresciute troppo. Hanno solo bisogno di un po' di attenzione.",
      soly_line2: "Iniziamo ripulendo prima il giardino centrale. Una volta sistemato, possiamo lavorare sugli altri!",
      maria_line3: "È un ottimo piano! Non vedo l'ora di vedere questo giardino fiorire di nuovo!",
    },
    map: {
      main_garden: 'Giardino Principale',
      zen_garden: 'Giardino Zen',
      tropical_garden: 'Paradiso Tropicale',
      desert_garden: 'Oasi del Deserto',
      winter_garden: 'Paese delle Meraviglie Invernale',
      coming_soon: 'Prossimamente',
    },
    settings: {
      title: 'Impostazioni',
      sound: 'Effetti Sonori',
      music: 'Musica di Sottofondo',
      volume: 'Volume',
      mute: 'Muto',
      connect_account: 'Collega Account',
      google: 'Google',
      apple: 'Apple',
      email: 'Email',
      version: 'Versione',
      language: 'Lingua',
      select_language: 'Seleziona Lingua',
      connected: 'Connesso',
      not_connected: 'Non Connesso',
    },
    languages: {
      english: 'Inglese',
      italian: 'Italiano',
      greek: 'Greco',
      spanish: 'Spagnolo',
    },
  },
  el: {
    common: {
      loading: 'Φόρτωση',
      continue: 'Συνέχεια',
      back: 'Πίσω',
      close: 'Κλείσιμο',
      save: 'Αποθήκευση',
      cancel: 'Ακύρωση',
      enter: 'Είσοδος',
      locked: 'Κλειδωμένο',
      settings: 'Ρυθμίσεις',
      play: 'Παιχνίδι',
    },
    loading: {
      title: 'Merge Garden',
      subtitle: 'Επαναφέρετε τον Κήπο των Ονείρων σας',
      tip: 'Προετοιμασία σπόρων...',
    },
    dialogue: {
      tap_continue: 'Πατήστε για συνέχεια',
    },
    intro: {
      maria_line1: "Ω πω πω... κοίτα αυτόν τον παλιό κήπο! Πρέπει να ήταν τόσο όμορφος κάποτε.",
      soly_line1: "Βλέπω τις δυνατότητες! Με λίγη αγάπη και φροντίδα, μπορούμε να τον επαναφέρουμε στην παλιά του δόξα!",
      maria_line2: "Έχεις δίκιο, Soly! Κοίτα όλα αυτά τα φυτά που μεγάλωσαν. Χρειάζονται απλώς λίγη προσοχή.",
      soly_line2: "Ας ξεκινήσουμε καθαρίζοντας πρώτα τον κεντρικό κήπο. Μόλις τον φτιάξουμε, μπορούμε να δουλέψουμε στους άλλους!",
      maria_line3: "Αυτό είναι ένα εξαιρετικό σχέδιο! Ανυπομονώ να δω αυτόν τον κήπο να ανθίζει ξανά!",
    },
    map: {
      main_garden: 'Κύριος Κήπος',
      zen_garden: 'Κήπος Ζεν',
      tropical_garden: 'Τροπικός Παράδεισος',
      desert_garden: 'Όαση Ερήμου',
      winter_garden: 'Χειμερινή Χώρα των Θαυμάτων',
      coming_soon: 'Έρχεται Σύντομα',
    },
    settings: {
      title: 'Ρυθμίσεις',
      sound: 'Ηχητικά Εφέ',
      music: 'Μουσική Υπόκρουση',
      volume: 'Ένταση',
      mute: 'Σίγαση',
      connect_account: 'Σύνδεση Λογαριασμού',
      google: 'Google',
      apple: 'Apple',
      email: 'Email',
      version: 'Έκδοση',
      language: 'Γλώσσα',
      select_language: 'Επιλογή Γλώσσας',
      connected: 'Συνδεδεμένο',
      not_connected: 'Μη Συνδεδεμένο',
    },
    languages: {
      english: 'Αγγλικά',
      italian: 'Ιταλικά',
      greek: 'Ελληνικά',
      spanish: 'Ισπανικά',
    },
  },
  es: {
    common: {
      loading: 'Cargando',
      continue: 'Continuar',
      back: 'Atrás',
      close: 'Cerrar',
      save: 'Guardar',
      cancel: 'Cancelar',
      enter: 'Entrar',
      locked: 'Bloqueado',
      settings: 'Ajustes',
      play: 'Jugar',
    },
    loading: {
      title: 'Merge Garden',
      subtitle: 'Restaura Tu Jardín de Ensueño',
      tip: 'Preparando las semillas...',
    },
    dialogue: {
      tap_continue: 'Toca para continuar',
    },
    intro: {
      maria_line1: "¡Oh wow... mira este viejo jardín! Debe haber sido tan hermoso una vez.",
      soly_line1: "¡Veo el potencial! ¡Con un poco de amor y cuidado, podemos restaurarlo a su antigua gloria!",
      maria_line2: "¡Tienes razón, Soly! Mira todas estas plantas crecidas. Solo necesitan un poco de atención.",
      soly_line2: "¡Empecemos limpiando primero el jardín central. Una vez que lo arreglemos, podemos trabajar en los otros!",
      maria_line3: "¡Es un gran plan! ¡No puedo esperar a ver este jardín florecer de nuevo!",
    },
    map: {
      main_garden: 'Jardín Principal',
      zen_garden: 'Jardín Zen',
      tropical_garden: 'Paraíso Tropical',
      desert_garden: 'Oasis del Desierto',
      winter_garden: 'País de las Maravillas Invernal',
      coming_soon: 'Próximamente',
    },
    settings: {
      title: 'Ajustes',
      sound: 'Efectos de Sonido',
      music: 'Música de Fondo',
      volume: 'Volumen',
      mute: 'Silenciar',
      connect_account: 'Conectar Cuenta',
      google: 'Google',
      apple: 'Apple',
      email: 'Correo',
      version: 'Versión',
      language: 'Idioma',
      select_language: 'Seleccionar Idioma',
      connected: 'Conectado',
      not_connected: 'No Conectado',
    },
    languages: {
      english: 'Inglés',
      italian: 'Italiano',
      greek: 'Griego',
      spanish: 'Español',
    },
  },
};

export const languageNames: Record<Language, string> = {
  en: 'English',
  it: 'Italiano',
  el: 'Ελληνικά',
  es: 'Español',
};

export const languageFlags: Record<Language, string> = {
  en: 'GB',
  it: 'IT',
  el: 'GR',
  es: 'ES',
};
