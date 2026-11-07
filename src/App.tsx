import { useEffect, useRef, useState } from "react";

const CDN = "https://bellismile.com/cdn/shop/files/";
const images = {
  hero: `${CDN}Sourire_lumineux_au_serum_violet_3000x.png`,
  product: `${CDN}01_29_55_065456cf-e7aa-43dd-a60f-3ef6a210388c.png`,
  editorial: `${CDN}Untitled_design_800x.png`,
  gallery: [
    `${CDN}IMG_0646.png`,
    `${CDN}IMG_0642.png`,
    `${CDN}7.png`,
    `${CDN}9.png`,
    `${CDN}8.png`,
    `${CDN}10.png`,
    `${CDN}IMG_0638.png`,
  ],
};

const packs = [
  { id: "solo", name: "Solo", qty: 1, price: 29.9, description: "Idéal pour un premier essai" },
  {
    id: "duo",
    name: "Duo",
    qty: 2,
    price: 54.9,
    old: 59.8,
    discount: "8 % de réduction",
    description: "Parfait pour prolonger l'expérience ou partager",
    badge: "Best-seller",
  },
  {
    id: "trio",
    name: "Trio",
    qty: 3,
    price: 79.9,
    old: 89.7,
    discount: "11 % de réduction",
    description: "Idéal pour une utilisation régulière ou pour offrir",
    badge: "Le plus avantageux",
  },
];

const reviews = [
  {
    quote: "L'effet est immédiat, c'est bluffant. Je l'utilise avant chaque soirée.",
    detail: "Camille D.",
  },
  {
    quote: "Enfin un produit doux qui fait vraiment la différence sur les photos.",
    detail: "Sarah L.",
  },
  {
    quote: "Simple, rapide et le flacon est magnifique. Mon nouveau geste beauté.",
    detail: "Inès M.",
  },
  {
    quote: "Mon sourire paraît tout de suite plus lumineux, je me sens plus confiante.",
    detail: "Laura B.",
  },
];

const faqs = [
  [
    "Est-ce un blanchiment dentaire ?",
    "Non. BelliSmile est un correcteur de couleur cosmétique : il neutralise visuellement les reflets jaunes pour un effet d'éclat instantané et temporaire. Il ne modifie pas la couleur réelle de l'émail.",
  ],
  [
    "Combien de temps dure l'effet ?",
    "L'effet se prolonge quelques heures, jusqu'au prochain brossage ou repas. C'est le geste parfait juste avant un rendez-vous, une soirée ou une photo.",
  ],
  [
    "Est-ce doux pour les dents sensibles ?",
    "Oui. La formule est sans peroxyde et non abrasive : elle respecte l'émail et s'utilise facilement entre deux séances de blanchiment.",
  ],
  [
    "Quels sont les délais de livraison ?",
    "Expédition sous 24 h ouvrées depuis la France. Comptez 2 à 4 jours ouvrés en point relais, avec la livraison offerte en France métropolitaine.",
  ],
  [
    "Puis-je retourner ma commande ?",
    "Oui, vous disposez de 14 jours après réception pour nous retourner le produit non ouvert. Les frais de retour sont à la charge du client.",
  ],
];

type ChatAction =
  | "packs"
  | "science"
  | "ritual"
  | "faq"
  | "add-solo"
  | "add-duo"
  | "cart"
  | "email";
type ChatMessage = {
  id: number;
  from: "bot" | "user";
  text: string;
  action?: ChatAction;
  actionLabel?: string;
};

const knowledgeBase: {
  keywords: string[];
  answer: string;
  action?: ChatAction;
  actionLabel?: string;
}[] = [
  {
    keywords: ["bonjour", "salut", "hello", "bonsoir", "coucou", "aide"],
    answer:
      "Bonjour ! Je suis l'assistant BelliSmile. Je connais le sérum, son utilisation, nos packs, la livraison et les retours. Que puis-je faire pour vous ?",
  },
  {
    keywords: ["produit", "serum", "bellismile", "quoi", "fonctionne", "principe"],
    answer:
      "BelliSmile est un sérum correcteur de couleur dentaire de 30 ml. Sa teinte violette, complémentaire du jaune, neutralise optiquement les reflets jaunes pour rendre le sourire immédiatement plus lumineux. C'est un effet cosmétique temporaire, pas un blanchiment.",
    action: "science",
    actionLabel: "Découvrir la science du violet",
  },
  {
    keywords: [
      "utiliser",
      "utilisation",
      "appliquer",
      "application",
      "mode",
      "emploi",
      "brosse",
      "comment",
    ],
    answer:
      "Déposez une petite noisette sur une brosse à dents propre et sèche, brossez doucement l'ensemble du sourire pendant 30 secondes, puis recrachez l'excédent. Pour prolonger l'effet, évitez de boire ou manger pendant 30 minutes.",
    action: "ritual",
    actionLabel: "Voir le rituel en 3 étapes",
  },
  {
    keywords: ["duree", "temps", "combien", "effet", "tient", "permanent"],
    answer:
      "L'effet visuel est immédiat et temporaire. Il se prolonge généralement quelques heures, jusqu'au prochain repas ou brossage. Le sérum est idéal juste avant une soirée, un rendez-vous, un événement ou des photos.",
  },
  {
    keywords: ["blanchiment", "blanchir", "peroxyde", "email", "abime", "dangereux"],
    answer:
      "Ce n'est pas un traitement blanchissant : le sérum ne modifie pas la couleur réelle de l'émail. Sa formule est sans peroxyde et non abrasive. Elle corrige visuellement la couleur, comme un correcteur de teint pour le sourire.",
    action: "science",
    actionLabel: "Comprendre son fonctionnement",
  },
  {
    keywords: ["sensible", "sensibilite", "gencive", "douleur", "dents sensibles"],
    answer:
      "La formule sans peroxyde et non abrasive est pensée pour respecter l'émail et convient généralement aux dents sensibles. Évitez toutefois le contact prolongé avec les gencives et arrêtez l'utilisation en cas d'inconfort.",
  },
  {
    keywords: ["ingredient", "composition", "vegan", "animaux", "cruelty", "formule"],
    answer:
      "La formule BelliSmile est vegan, sans peroxyde et non abrasive. Pour une question précise liée à une allergie ou pour obtenir la liste INCI complète, écrivez à contact@bellismile.com avant utilisation.",
    action: "email",
    actionLabel: "Poser une question à l'équipe",
  },
  {
    keywords: ["enceinte", "grossesse", "allaitement", "enfant", "mineur", "medical", "medecin"],
    answer:
      "Par précaution, en cas de grossesse, d'allaitement, de traitement dentaire ou pour une utilisation par un mineur, demandez l'avis de votre dentiste ou professionnel de santé. BelliSmile est un cosmétique et ne remplace pas un suivi médical.",
  },
  {
    keywords: ["couronne", "facette", "implant", "prothese", "appareil"],
    answer:
      "Le résultat est optimal sur l'émail naturel. Sur les couronnes, facettes, implants et autres prothèses, l'effet visuel peut varier selon la teinte et la surface. Le sérum ne change pas leur couleur réelle.",
  },
  {
    keywords: ["frequence", "souvent", "fois", "quotidien", "tous les jours"],
    answer:
      "Vous pouvez l'intégrer ponctuellement à votre routine, notamment avant un moment important. Il suffit de 30 secondes par application. Respectez les conseils d'utilisation et cessez l'usage en cas d'irritation.",
  },
  {
    keywords: ["prix", "tarif", "coute", "combien", "pack", "offre"],
    answer:
      "Le pack Solo coûte 29,90 €, le Duo 54,90 € au lieu de 59,80 € et le Trio 79,90 € au lieu de 89,70 €. La livraison est offerte en France. Le Duo est notre best-seller.",
    action: "packs",
    actionLabel: "Comparer les packs",
  },
  {
    keywords: ["choisir", "conseille", "meilleur", "solo", "duo", "trio", "quel pack"],
    answer:
      "Pour découvrir le produit, choisissez Solo. Le Duo est le meilleur équilibre et notre best-seller : il permet de prolonger l'expérience ou de partager. Le Trio offre la meilleure réduction pour une utilisation régulière ou un cadeau.",
    action: "add-duo",
    actionLabel: "Ajouter le Duo au panier",
  },
  {
    keywords: ["livraison", "expedition", "delai", "recevoir", "relais", "domicile", "transport"],
    answer:
      "Les commandes sont expédiées sous 24 h ouvrées depuis la France. La réception prend généralement 2 à 4 jours ouvrés en point relais. La livraison est offerte en France métropolitaine, sans minimum d'achat.",
  },
  {
    keywords: ["retour", "remboursement", "rembourser", "retractation", "annuler"],
    answer:
      "Vous disposez de 14 jours après réception pour retourner un produit non ouvert. Les frais de retour restent à la charge du client. Écrivez à contact@bellismile.com avec votre numéro de commande pour recevoir les instructions.",
    action: "email",
    actionLabel: "Demander un retour",
  },
  {
    keywords: ["paiement", "payer", "carte", "paypal", "apple pay", "securise"],
    answer:
      "Les moyens de paiement affichés sont Visa, Mastercard, PayPal, Apple Pay et Google Pay. Le paiement est sécurisé et les prix incluent la TVA.",
  },
  {
    keywords: ["commande", "suivi", "colis", "numero", "ou est", "retard"],
    answer:
      "Le suivi réel d'une commande nécessite votre e-mail ou numéro de commande et n'est pas accessible dans ce chat hors ligne. Écrivez à contact@bellismile.com : l'équipe répond sous 24 h ouvrées.",
    action: "email",
    actionLabel: "Contacter le service client",
  },
  {
    keywords: ["promo", "reduction", "code", "premiere commande", "10"],
    answer:
      "Vous bénéficiez de −10 % sur votre première commande en vous inscrivant au Club BelliSmile avec votre e-mail dans la section newsletter. Le code de bienvenue est ensuite envoyé dans votre boîte mail.",
  },
  {
    keywords: ["france", "francais", "fabrique", "origine", "marque"],
    answer:
      "BelliSmile est une marque française. Les commandes sont préparées et expédiées depuis la France sous 24 h ouvrées.",
  },
  {
    keywords: ["avis", "note", "client", "resultat", "preuve"],
    answer:
      "BelliSmile affiche une note de 4,9/5 sur 16 avis vérifiés et plus de 3 500 clientes. Les résultats sont visuels, immédiats et peuvent varier selon la teinte naturelle des dents.",
    action: "faq",
    actionLabel: "Voir les avis et réponses",
  },
  {
    keywords: ["contact", "humain", "conseiller", "email", "telephone", "parler"],
    answer:
      "L'équipe BelliSmile répond sous 24 h ouvrées à contact@bellismile.com. Pour une commande, pensez à indiquer votre numéro de commande dans le message.",
    action: "email",
    actionLabel: "Écrire à BelliSmile",
  },
];

const quickQuestions = [
  "Comment utiliser le sérum ?",
  "Quel pack choisir ?",
  "Est-ce un blanchiment ?",
  "Quels sont les délais ?",
];

function normalizeText(value: string) {
  return value
    .toLocaleLowerCase("fr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ");
}

function getKnowledgeAnswer(question: string) {
  const normalized = normalizeText(question);
  const terms = normalized.split(/\s+/).filter((term) => term.length > 2);
  let best = knowledgeBase[0];
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    const score = entry.keywords.reduce((total, keyword) => {
      const normalizedKeyword = normalizeText(keyword);
      if (normalized.includes(normalizedKeyword))
        return total + (normalizedKeyword.includes(" ") ? 5 : 3);
      return (
        total +
        terms.filter((term) => normalizedKeyword.includes(term) || term.includes(normalizedKeyword))
          .length
      );
    }, 0);
    if (score > bestScore) {
      best = entry;
      bestScore = score;
    }
  }

  if (bestScore === 0) {
    return {
      answer:
        "Je n'ai pas trouvé de réponse suffisamment précise dans les informations BelliSmile. Je peux vous renseigner sur le produit, l'utilisation, les packs, la livraison, les retours ou vous mettre en contact avec l'équipe.",
      action: "email" as ChatAction,
      actionLabel: "Demander à l'équipe",
    };
  }
  return best;
}

const formatPrice = (price: number) => `${price.toFixed(2).replace(".", ",")} €`;

function Icon({
  name,
  size = 18,
}: {
  name:
    | "bag"
    | "menu"
    | "close"
    | "arrow"
    | "instagram"
    | "tiktok"
    | "check"
    | "minus"
    | "plus"
    | "chat"
    | "send"
    | "sparkle"
    | "trash";
  size?: number;
}) {
  const paths: Record<string, React.ReactNode> = {
    bag: (
      <>
        <path d="M6 8h12l-1 12H7L6 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),
    menu: (
      <>
        <path d="M4 8h16M4 16h16" />
      </>
    ),
    close: (
      <>
        <path d="m5 5 14 14M19 5 5 19" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M14 7l5 5-5 5" />
      </>
    ),
    instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
      </>
    ),
    tiktok: (
      <>
        <path d="M15 4v10a5 5 0 1 1-4-4.9" />
        <path d="M15 4c.4 2.5 2 4 4 4" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    minus: <path d="M5 12h14" />,
    plus: (
      <>
        <path d="M5 12h14M12 5v14" />
      </>
    ),
    chat: (
      <>
        <path d="M21 12a8 8 0 0 1-8 8H6l-4 2 1.4-4.2A9 9 0 1 1 21 12Z" />
        <path d="M8 12h.01M12 12h.01M16 12h.01" strokeWidth="2" />
      </>
    ),
    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4 20-7Z" />
        <path d="M22 2 11 13" />
      </>
    ),
    sparkle: (
      <>
        <path d="m12 3 1.2 4.1L17 9l-3.8 1.9L12 15l-1.2-4.1L7 9l3.8-1.9L12 3Z" />
        <path d="m19 15 .6 2.1 1.9.9-1.9.9L19 21l-.6-2.1-1.9-.9 1.9-.9L19 15ZM5 3l.5 1.6L7 5.5l-1.5.9L5 8l-.5-1.6L3 5.5l1.5-.9L5 3Z" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function Stars({ small = false }: { small?: boolean }) {
  return (
    <span className={`stars ${small ? "small" : ""}`} aria-label="5 étoiles">
      ★★★★★
    </span>
  );
}

export default function App() {
  const [menu, setMenu] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem("bellismile_cart_v1") || "{}");
    } catch {
      return {};
    }
  });
  const [added, setAdded] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatTyping, setChatTyping] = useState(false);
  const [chatUnread, setChatUnread] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("bellismile_chat_v1") || "[]");
      if (Array.isArray(saved) && saved.length) return saved;
    } catch {
      // Start a new conversation if stored data cannot be read.
    }
    return [
      {
        id: 1,
        from: "bot",
        text: "Bonjour, je suis votre conseillère BelliSmile. Je peux vous aider à choisir un pack et répondre à toutes vos questions sur le sérum.",
      },
    ];
  });
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => localStorage.setItem("bellismile_cart_v1", JSON.stringify(cart)), [cart]);
  useEffect(
    () => localStorage.setItem("bellismile_chat_v1", JSON.stringify(chatMessages.slice(-30))),
    [chatMessages],
  );
  useEffect(() => {
    if (chatOpen) {
      setChatUnread(false);
      window.setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    }
  }, [chatOpen, chatMessages, chatTyping]);
  useEffect(() => {
    document.body.style.overflow = cartOpen || menu || chatOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, menu, chatOpen]);

  const cartItems = packs
    .filter((pack) => cart[pack.id])
    .map((pack) => ({ ...pack, count: cart[pack.id] }));
  const cartCount = cartItems.reduce((sum, item) => sum + item.count, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.count, 0);

  function addToCart(id: string) {
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
    setAdded(id);
    window.setTimeout(() => setAdded(""), 1500);
  }

  function goTo(id: string) {
    setMenu(false);
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  }

  function sendChatMessage(value = chatInput) {
    const question = value.trim();
    if (!question || chatTyping) return;
    const answer = getKnowledgeAnswer(question);
    setChatMessages((messages) => [...messages, { id: Date.now(), from: "user", text: question }]);
    setChatInput("");
    setChatTyping(true);
    window.setTimeout(() => {
      setChatMessages((messages) => [
        ...messages,
        {
          id: Date.now() + 1,
          from: "bot",
          text: answer.answer,
          action: answer.action,
          actionLabel: answer.actionLabel,
        },
      ]);
      setChatTyping(false);
      if (!chatOpen) setChatUnread(true);
    }, 550);
  }

  function handleChatAction(action: ChatAction) {
    if (action === "email") {
      window.location.href =
        "mailto:contact@bellismile.com?subject=Question%20depuis%20le%20site%20BelliSmile";
      return;
    }
    if (action === "add-solo" || action === "add-duo") {
      addToCart(action === "add-solo" ? "solo" : "duo");
      setChatOpen(false);
      setCartOpen(true);
      return;
    }
    if (action === "cart") {
      setChatOpen(false);
      setCartOpen(true);
      return;
    }
    const targets: Record<string, string> = {
      packs: "#packs",
      science: "#science",
      ritual: "#rituel",
      faq: "#faq",
    };
    setChatOpen(false);
    goTo(targets[action]);
  }

  function resetChat() {
    setChatMessages([
      {
        id: Date.now(),
        from: "bot",
        text: "Nouvelle conversation ouverte. Comment puis-je vous aider aujourd'hui ?",
      },
    ]);
  }

  return (
    <div className="site-shell">
      <div className="announcement">
        <span>−10 % sur votre première commande</span>
        <span>Livraison offerte en France — Point Relais</span>
        <span className="desktop-only">Marque française</span>
      </div>

      <header className="header">
        <button
          className="mobile-menu-button"
          onClick={() => setMenu(true)}
          aria-label="Ouvrir le menu"
        >
          <Icon name="menu" size={22} />
        </button>
        <nav className="desktop-nav" aria-label="Navigation principale">
          <button onClick={() => goTo("#packs")}>Le sérum</button>
          <button onClick={() => goTo("#science")}>La science</button>
          <button onClick={() => goTo("#rituel")}>Le rituel</button>
          <button onClick={() => goTo("#avis")}>Les avis</button>
          <button onClick={() => goTo("#faq")}>FAQ</button>
        </nav>
        <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span>
            Belli<span>Smile</span>
          </span>
          <small>Paris</small>
        </button>
        <div className="header-actions">
          <span className="currency desktop-only">France · EUR €</span>
          <button className="order-link desktop-only" onClick={() => goTo("#packs")}>
            Passer commande
          </button>
          <button
            className="bag-button"
            onClick={() => setCartOpen(true)}
            aria-label={`Panier, ${cartCount} article`}
          >
            <Icon name="bag" size={21} />
            {cartCount > 0 && <span>{cartCount}</span>}
          </button>
        </div>
      </header>

      {menu && (
        <div className="mobile-menu">
          <button className="menu-close" onClick={() => setMenu(false)} aria-label="Fermer">
            <Icon name="close" size={24} />
          </button>
          <div className="menu-brand">
            Belli<span>Smile</span>
          </div>
          <nav>
            {[
              ["Le sérum", "#packs"],
              ["La science", "#science"],
              ["Le rituel", "#rituel"],
              ["Les avis", "#avis"],
              ["FAQ", "#faq"],
            ].map(([label, id]) => (
              <button key={id} onClick={() => goTo(id)}>
                {label}
                <Icon name="arrow" />
              </button>
            ))}
          </nav>
          <p>Marque française · Livraison offerte</p>
        </div>
      )}

      <main>
        <section className="hero">
          <div className="hero-glow" />
          <div className="hero-copy">
            <p className="eyebrow">Correcteur de couleur dentaire · 30 ml</p>
            <h1>
              Votre sourire,
              <br />
              <em>enfin lumineux.</em>
            </h1>
            <p className="lead">
              Le sérum violet BelliSmile neutralise visuellement les reflets jaunes en quelques
              secondes. Pas de peroxyde, pas d'émail agressé — juste un coup d'éclat instantané,
              avant ce qui compte.
            </p>
            <div className="button-row">
              <button className="button dark" onClick={() => goTo("#packs")}>
                Découvrir le sérum — 29,90 € <Icon name="arrow" size={16} />
              </button>
              <button className="button ghost" onClick={() => goTo("#packs")}>
                Voir les packs
              </button>
            </div>
            <div className="hero-trust">
              <span>
                <Stars /> <b>4.9/5 · 16 avis · 3 500+ clientes</b>
              </span>
              <i />
              <b>Livraison offerte en France</b>
            </div>
          </div>
          <div className="hero-visual">
            <div className="image-frame">
              <img src={images.hero} alt="Sourire lumineux avec le sérum violet BelliSmile" />
              <div className="image-caption">
                <small>Effet visuel immédiat</small>
                <strong>Un sourire plus lumineux</strong>
              </div>
              <span className="thirty">en 30 secondes</span>
            </div>
            <div className="hero-benefits">
              {["Sans peroxyde", "Formule vegan", "Fabriqué en France", "30 ml · 30 secondes"].map(
                (item) => (
                  <span key={item}>
                    <i />
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>
        </section>

        <div className="marquee">
          <div>
            {[..."12"]
              .flatMap(() => [
                "Marque française",
                "Livraison offerte en France",
                "Expédition sous 24 h",
                "Paiement 100 % sécurisé",
                "Satisfait ou remboursé 14 jours",
              ])
              .map((item, i) => (
                <span key={i}>
                  {item}
                  <b>◆</b>
                </span>
              ))}
          </div>
        </div>

        <section className="problem section-grid">
          <div>
            <p className="eyebrow">Le constat</p>
            <h2>
              Quand le sourire
              <br />
              <em>perd son éclat.</em>
            </h2>
            <p className="section-lead">
              Le jaunissement n'est pas une fatalité : c'est une histoire de lumière. Et la lumière,
              ça se corrige.
            </p>
          </div>
          <div className="problem-list">
            {[
              [
                "Sourire terni",
                "L'éclat naturel de votre sourire semble s'estomper au fil du temps.",
              ],
              [
                "Café, thé, tabac",
                "Ces habitudes du quotidien accentuent visuellement les tons jaunes.",
              ],
              [
                "Perte d'éclat",
                "Sur les photos ou lors des moments importants, le sourire paraît moins lumineux.",
              ],
              [
                "Manque de confiance",
                "Quand on n'aime pas totalement son sourire, on le montre moins spontanément.",
              ],
            ].map(([title, text], i) => (
              <article key={title}>
                <div>
                  <small>0{i + 1}</small>
                  <h3>{title}</h3>
                </div>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="moment">
          <div className="center-heading">
            <p className="eyebrow">Le moment parfait</p>
            <h2>
              Le petit geste beauté,
              <br />
              <em>avant le moment qui compte.</em>
            </h2>
            <p>
              Trente secondes suffisent pour raviver l'éclat du sourire et arriver avec une longueur
              d'avance — sur les photos comme dans la vraie vie.
            </p>
          </div>
          <div className="pills">
            {[
              "Avant une soirée",
              "Avant un rendez-vous",
              "Avant une photo importante",
              "Avant un événement",
              "Quand vous voulez vous sentir confiant(e) immédiatement",
            ].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <button className="button dark" onClick={() => goTo("#packs")}>
            Je veux un sourire plus lumineux <Icon name="arrow" size={16} />
          </button>
        </section>

        <section className="science" id="science">
          <div className="science-visual">
            <img
              className="product-image"
              src={images.product}
              alt="Sérum correcteur de couleur BelliSmile"
            />
            <img className="science-detail" src={images.gallery[3]} alt="Détail du sérum violet" />
          </div>
          <div className="science-copy">
            <p className="eyebrow">La science du violet</p>
            <h2>
              Le violet
              <br />
              <em>neutralise le jaune.</em>
            </h2>
            <p className="section-lead">
              Sur la roue chromatique, le violet est la couleur complémentaire du jaune. Appliqué
              sur l'émail, il annule optiquement les reflets indésirables. Le principe du correcteur
              de teint, mais pour les dents.
            </p>
            <div className="color-theory">
              <span />
              <span />
              <p>
                <b>Jaune + violet</b> = un sourire visuellement plus blanc, sans altérer l'émail.
              </p>
            </div>
            <div className="stats">
              <div>
                <strong>0 %</strong>
                <small>de peroxyde</small>
              </div>
              <div>
                <strong>30 s</strong>
                <small>d'application</small>
              </div>
              <div>
                <strong>30 ml</strong>
                <small>format voyage</small>
              </div>
            </div>
          </div>
        </section>

        <section className="packs" id="packs">
          <div className="center-heading">
            <p className="eyebrow">Nos packs</p>
            <h2>
              Choisissez votre <em>rituel</em>
            </h2>
            <p>
              Un sérum pour essayer, deux pour prolonger l'expérience, trois pour partager — ou ne
              plus jamais en manquer.
            </p>
          </div>
          <div className="pack-grid">
            {packs.map((pack) => (
              <article className={`pack-card ${pack.id === "duo" ? "featured" : ""}`} key={pack.id}>
                {pack.badge && <span className="badge">{pack.badge}</span>}
                <div className="pack-head">
                  <div>
                    <small>
                      {pack.qty} sérum{pack.qty > 1 ? "s" : ""} · 30 ml
                    </small>
                    <h3>{pack.name}</h3>
                  </div>
                  <div className="mini-products">
                    {Array.from({ length: pack.qty }).map((_, i) => (
                      <span key={i}>
                        <img src={images.product} alt="" />
                      </span>
                    ))}
                  </div>
                </div>
                <p>{pack.description}</p>
                <div className="price">
                  <strong>{formatPrice(pack.price)}</strong>
                  {pack.old && <del>{formatPrice(pack.old)}</del>}
                </div>
                {pack.discount && <small className="discount">{pack.discount}</small>}
                <button onClick={() => addToCart(pack.id)}>
                  {added === pack.id ? "✓ Ajouté" : "Ajouter au panier"}
                </button>
                <small className="delivery">★ Livraison offerte · retour 14 jours</small>
              </article>
            ))}
          </div>
        </section>

        <section className="ritual" id="rituel">
          <div>
            <p className="eyebrow">Le rituel</p>
            <h2>
              Trente secondes,
              <br />
              <em>et c'est fait.</em>
            </h2>
            <p>
              Le geste s'intègre à votre routine en un éclair — juste avant de sortir, de sourire,
              d'apparaître.
            </p>
          </div>
          <div className="steps">
            {[
              [
                "01",
                "Une noisette de sérum",
                "Déposez une petite quantité de sérum violet sur une brosse à dents propre et sèche.",
              ],
              [
                "02",
                "30 secondes de brossage",
                "Brossez l'ensemble du sourire, sans frotter trop fort. Le violet neutralise les reflets jaunes.",
              ],
              [
                "03",
                "L'éclat, immédiatement",
                "Crachez l'excédent. Évitez de boire ou de manger pendant 30 minutes pour prolonger l'effet.",
              ],
            ].map(([number, title, text]) => (
              <article key={number}>
                <strong>{number}</strong>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
            <aside>
              <b>À savoir :</b> BelliSmile n'est pas un blanchiment dentaire, mais un correcteur de
              couleur pour un effet visuel instantané et temporaire.
            </aside>
          </div>
        </section>

        <section className="gallery">
          <div className="gallery-head">
            <div>
              <p className="eyebrow">En images</p>
              <h2>
                Le sourire, <em>sans filtre.</em>
              </h2>
            </div>
            <a href="https://www.instagram.com/bellismile.co" target="_blank" rel="noreferrer">
              <Icon name="instagram" /> @bellismile.co
            </a>
          </div>
          <div className="gallery-scroll">
            {images.gallery.map((src, i) => (
              <figure key={src}>
                <img src={src} alt={`BelliSmile en situation ${i + 1}`} />
              </figure>
            ))}
          </div>
        </section>

        <section className="reviews" id="avis">
          <div className="reviews-summary">
            <p className="eyebrow">Elles en parlent</p>
            <h2>
              4.9/5 <em>sur 16 avis vérifiés</em>
            </h2>
            <Stars />
            <p>
              Plus de 3 500+ sourires déjà éclaircis. Le geste est devenu le réflexe d'avant les
              grands moments.
            </p>
          </div>
          <div className="review-grid">
            {reviews.map((review) => (
              <figure key={review.quote}>
                <Stars small />
                <blockquote>« {review.quote} »</blockquote>
                <figcaption>{review.detail} · Achat vérifié</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="editorial">
          <img src={images.editorial} alt="BelliSmile, sourire éclatant" />
          <div>
            <p className="eyebrow">La maison BelliSmile</p>
            <h2>
              La confiance commence
              <br />
              <em>par un sourire.</em>
            </h2>
            <p>
              Nous avons imaginé BelliSmile comme un geste beauté aussi simple qu'un trait de rouge
              à lèvres. Une formule douce, un résultat immédiat et une envie : vous faire sourire
              sans retenue.
            </p>
            <button className="button light" onClick={() => goTo("#packs")}>
              Découvrir notre sérum <Icon name="arrow" size={16} />
            </button>
          </div>
        </section>

        <section className="faq" id="faq">
          <div>
            <p className="eyebrow">Questions fréquentes</p>
            <h2>
              Tout savoir,
              <br />
              <em>avant de sourire.</em>
            </h2>
            <p className="section-lead">
              Le sérum, son utilisation et votre commande : nous répondons aux questions les plus
              fréquentes.
            </p>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer], i) => (
              <article className={openFaq === i ? "open" : ""} key={question}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{question}</span>
                  <Icon name={openFaq === i ? "minus" : "plus"} />
                </button>
                <div>
                  <p>{answer}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="newsletter">
          <div>
            <p className="eyebrow">Le club BelliSmile</p>
            <h2>
              −10 % sur votre
              <br />
              <em>première commande.</em>
            </h2>
          </div>
          <div>
            {subscribed ? (
              <p className="success">
                <Icon name="check" /> Merci ! Votre code de bienvenue arrive dans votre boîte mail.
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) setSubscribed(true);
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse e-mail"
                  required
                />
                <button aria-label="S'inscrire">
                  <Icon name="arrow" />
                </button>
              </form>
            )}
            <p>
              En vous inscrivant, vous acceptez de recevoir nos nouvelles. Désinscription à tout
              moment.
            </p>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-main">
          <div className="footer-brand">
            <div>
              Belli<span>Smile</span>
            </div>
            <p>Votre sourire, enfin lumineux.</p>
            <div className="socials">
              <a href="https://www.instagram.com/bellismile.co" aria-label="Instagram">
                <Icon name="instagram" />
              </a>
              <a href="https://www.tiktok.com/@bellismile.co" aria-label="TikTok">
                <Icon name="tiktok" />
              </a>
            </div>
          </div>
          {[
            ["Boutique", ["Le sérum", "Les packs", "La science", "Le rituel"]],
            ["Aide", ["FAQ", "Livraison & retours", "Nous écrire", "Suivre ma commande"]],
            ["La maison", ["Notre histoire", "Mentions légales", "CGV", "Confidentialité"]],
          ].map(([title, links]) => (
            <div className="footer-column" key={title as string}>
              <h3>{title}</h3>
              {(links as string[]).map((link) => (
                <button key={link} onClick={() => (link === "FAQ" ? goTo("#faq") : goTo("#packs"))}>
                  {link}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© 2025 BelliSmile — Marque française</span>
          <span>Visa · Mastercard · PayPal · Apple Pay · Google Pay</span>
        </div>
      </footer>

      <button
        className={`chat-launcher ${chatOpen ? "active" : ""}`}
        onClick={() => setChatOpen((open) => !open)}
        aria-label={chatOpen ? "Fermer l'assistant" : "Ouvrir l'assistant BelliSmile"}
        aria-expanded={chatOpen}
      >
        {chatOpen ? <Icon name="close" size={23} /> : <Icon name="chat" size={23} />}
        {!chatOpen && chatUnread && <span />}
      </button>
      <section className={`chat-panel ${chatOpen ? "open" : ""}`} aria-hidden={!chatOpen}>
        <header className="chat-header">
          <div className="chat-avatar">
            <Icon name="sparkle" size={19} />
          </div>
          <div>
            <h2>Assistante BelliSmile</h2>
            <p>
              <span /> Disponible instantanément
            </p>
          </div>
          <button
            onClick={resetChat}
            title="Nouvelle conversation"
            aria-label="Effacer la conversation"
          >
            <Icon name="trash" size={18} />
          </button>
          <button
            className="chat-mobile-close"
            onClick={() => setChatOpen(false)}
            aria-label="Fermer"
          >
            <Icon name="close" size={20} />
          </button>
        </header>
        <div className="chat-knowledge">
          <Icon name="sparkle" size={13} />
          Réponses fondées sur les informations BelliSmile
        </div>
        <div className="chat-messages" role="log" aria-live="polite">
          <div className="chat-date">Aujourd'hui</div>
          {chatMessages.map((message) => (
            <div className={`chat-message ${message.from}`} key={message.id}>
              {message.from === "bot" && <div className="message-avatar">B</div>}
              <div>
                <p>{message.text}</p>
                {message.action && (
                  <button onClick={() => handleChatAction(message.action!)}>
                    {message.actionLabel} <Icon name="arrow" size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {chatTyping && (
            <div className="chat-message bot">
              <div className="message-avatar">B</div>
              <div className="typing" aria-label="L'assistante écrit">
                <i />
                <i />
                <i />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="chat-suggestions">
          {quickQuestions.map((question) => (
            <button key={question} onClick={() => sendChatMessage(question)}>
              {question}
            </button>
          ))}
        </div>
        <form
          className="chat-form"
          onSubmit={(event) => {
            event.preventDefault();
            sendChatMessage();
          }}
        >
          <label htmlFor="chat-input">Votre question</label>
          <div>
            <input
              id="chat-input"
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Écrivez votre question…"
              autoComplete="off"
              maxLength={300}
            />
            <button type="submit" disabled={!chatInput.trim() || chatTyping} aria-label="Envoyer">
              <Icon name="send" size={18} />
            </button>
          </div>
          <p>Assistant automatique · Pour un conseil médical, consultez un professionnel.</p>
        </form>
      </section>

      {cartOpen && <div className="cart-overlay" onMouseDown={() => setCartOpen(false)} />}
      <aside className={`cart ${cartOpen ? "open" : ""}`} aria-hidden={!cartOpen}>
        <div className="cart-head">
          <div>
            <p>Votre panier</p>
            <span>
              {cartCount} article{cartCount !== 1 ? "s" : ""}
            </span>
          </div>
          <button onClick={() => setCartOpen(false)} aria-label="Fermer le panier">
            <Icon name="close" size={22} />
          </button>
        </div>
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <span>
              <img src={images.product} alt="" />
            </span>
            <h3>Votre panier est vide</h3>
            <p>Il ne manque qu'un geste pour raviver l'éclat du jour.</p>
            <button
              className="button dark"
              onClick={() => {
                setCartOpen(false);
                goTo("#packs");
              }}
            >
              Découvrir le sérum
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <article key={item.id}>
                  <div className="cart-product">
                    <img src={images.product} alt="" />
                  </div>
                  <div className="cart-item-info">
                    <h3>Pack {item.name}</h3>
                    <small>
                      {item.qty} sérum{item.qty > 1 ? "s" : ""} · 30 ml
                    </small>
                    <div>
                      <button
                        onClick={() =>
                          setCart((c) => ({ ...c, [item.id]: Math.max(0, c[item.id] - 1) }))
                        }
                      >
                        −
                      </button>
                      <span>{item.count}</span>
                      <button onClick={() => setCart((c) => ({ ...c, [item.id]: c[item.id] + 1 }))}>
                        +
                      </button>
                    </div>
                  </div>
                  <strong>{formatPrice(item.price * item.count)}</strong>
                </article>
              ))}
            </div>
            <div className="cart-total">
              <div>
                <span>Sous-total</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <p>Livraison offerte en France · TVA incluse</p>
              <button className="button dark">Passer commande</button>
              <button className="continue" onClick={() => setCartOpen(false)}>
                Continuer mes achats
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
