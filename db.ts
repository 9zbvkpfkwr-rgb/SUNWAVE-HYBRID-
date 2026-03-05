
import { User, Order, Payment, Product, ContactMessage, InstallationPhase, BlogPost } from './types';
import { SUNWAVE_PACKS } from './constants';

const STORAGE_KEY = 'sunwave_hybrid_db_v5';
const SESSION_KEY = 'sunwave_user_session';

interface DBState {
  users: User[];
  products: Product[];
  orders: Order[];
  payments: Payment[];
  messages: ContactMessage[];
  blogPosts: BlogPost[];
  simulations: any[];
}

class DatabaseService {
  private state: DBState;

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    this.state = saved ? JSON.parse(saved) : this.getInitialState();
    this.state.products = SUNWAVE_PACKS;
    this.save();
  }

  private getInitialState(): DBState {
    return {
      users: [],
      products: SUNWAVE_PACKS,
      orders: [],
      payments: [],
      messages: [],
      simulations: [],
      blogPosts: [
        {
          id: 'blog-1',
          title: 'Pourquoi passer au Lithium en 2026 ?',
          excerpt: 'Découvrez les avantages technologiques et financiers des batteries lithium par rapport au plomb.',
          content: `
### L'Évolution du Stockage Énergétique en Afrique

Le passage au lithium n'est plus une option, mais une nécessité stratégique pour quiconque souhaite une indépendance énergétique réelle et durable. En 2026, les batteries Lithium-Fer-Phosphate (LiFePO4) s'imposent comme le standard absolu.

#### 1. Une Longévité Inégalée
Contrairement aux batteries au plomb qui s'essoufflent après 2 ou 3 ans, le lithium offre plus de **6000 cycles**. Cela représente plus de 10 ans d'utilisation quotidienne sans perte significative de capacité.

#### 2. Performance et Profondeur de Décharge
Une batterie lithium peut être déchargée à **90%** sans dommage, contre seulement 50% pour le plomb. Vous utilisez réellement l'énergie que vous payez.

#### 3. Un Investissement Rentable
Bien que le coût initial soit plus élevé, le coût par cycle est divisé par 4 sur la durée de vie du système. C'est le choix de la raison pour sécuriser votre patrimoine énergétique.

#### Conclusion
Chez Sunwave Hybrid, nous avons fait le choix de l'excellence en intégrant exclusivement des cellules lithium de grade A dans tous nos packs.
          `,
          image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=800',
          date: '2024-03-15',
          category: 'technologie'
        },
        {
          id: 'blog-2',
          title: 'Optimiser sa consommation solaire',
          excerpt: '5 conseils pratiques pour faire durer vos batteries toute la nuit sans coupure.',
          content: `
### Maîtrisez Votre Énergie : Guide de l'Efficacité Solaire

Avoir un système solaire est une première étape. Savoir l'utiliser est ce qui garantit votre confort 24h/24. Voici nos conseils d'experts pour maximiser votre autonomie.

#### 1. Déplacez vos usages lourds
Le soleil est votre générateur direct. Utilisez votre machine à laver, votre fer à repasser ou votre pompe à eau entre **10h et 15h**. Cela préserve vos batteries pour la nuit.

#### 2. Le passage au LED
Une ampoule classique consomme 60W. Une LED équivalente consomme 9W. Sur toute une maison, l'économie est massive et libère de la puissance pour vos équipements essentiels.

#### 3. Régulation de la climatisation
Réglez votre climatiseur sur **24°C** plutôt que 18°C. Le confort thermique reste excellent, mais la consommation du compresseur est réduite de 30%.

#### 4. Entretien des panneaux
Une fine couche de poussière peut réduire la production de 20%. Un nettoyage mensuel à l'eau claire suffit à maintenir vos performances au sommet.

#### Conclusion
L'intelligence énergétique commence par de petits gestes qui transforment votre expérience du solaire.
          `,
          image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=800',
          date: '2024-03-10',
          category: 'conseils'
        },
        {
          id: 'blog-3',
          title: 'La Sécurité Contractuelle Sunwave',
          excerpt: 'Comment nous sécurisons votre investissement via le séquestre notarial.',
          content: `
### Investir en Toute Sérénité : Le Modèle Sunwave

La confiance est le pilier de notre relation avec nos clients. Pour garantir la sécurité de vos fonds, Sunwave Hybrid a mis en place un workflow juridique unique en Afrique de l'Ouest.

#### 1. Le Séquestre Notarial
Vos acomptes ne sont pas versés directement sur notre compte courant. Ils sont déposés sur un compte séquestre géré par l'étude de Maître AKA T. Germain. Les fonds ne sont débloqués qu'après la livraison et l'installation effective.

#### 2. Garantie de Performance
Nos contrats incluent une clause de performance. Si le système ne produit pas l'énergie promise, nous intervenons sans frais pour ajuster l'installation.

#### 3. Transparence Totale
Chaque client dispose d'un accès à son tableau de bord digital pour suivre l'état de son dossier, de la commande à la maintenance.

#### Conclusion
Choisir Sunwave, c'est choisir une entreprise qui place la protection du consommateur au cœur de son modèle économique.
          `,
          image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800',
          date: '2024-03-05',
          category: 'juridique'
        },
        {
          id: 'blog-4',
          title: 'Solaire et Climatisation : Le Duel',
          excerpt: 'Est-il possible de faire tourner un split sur batterie ? La réponse technique.',
          content: `
### Climatisation Solaire : Mythe ou Réalité ?

C'est la question la plus fréquente : "Puis-je utiliser ma clim avec vos packs ?". La réponse est oui, mais avec une approche technique rigoureuse.

#### 1. Le pic de démarrage
Un climatiseur classique consomme 3 à 5 fois sa puissance nominale au démarrage. Nos onduleurs Sunwave Hybrid sont conçus pour encaisser ces pics grâce à leur technologie haute fréquence.

#### 2. La technologie Inverter
Pour le solaire, nous recommandons exclusivement des climatiseurs **Inverter**. Ils régulent leur consommation en douceur, évitant les chocs sur vos batteries et prolongeant leur durée de vie.

#### 3. Dimensionnement
Pour une clim 1 CV, nous recommandons au minimum notre **Pack Famille**. Cela garantit que vous ne videz pas vos batteries en 2 heures et que vous gardez de l'énergie pour le reste de la maison.

#### Conclusion
Le confort thermique est possible avec le solaire Sunwave, à condition de respecter les règles de dimensionnement que nos experts calculent pour vous.
          `,
          image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=800',
          date: '2024-03-01',
          category: 'technologie'
        },
        {
          id: 'blog-5',
          title: 'L\'impact du Solaire sur l\'Immobilier',
          excerpt: 'Comment une installation Sunwave augmente la valeur de votre villa de 15%.',
          content: `
### Valorisez Votre Patrimoine avec Sunwave

Une maison autonome n'est plus seulement un confort, c'est un actif financier. En Côte d'Ivoire, les villas équipées de systèmes solaires certifiés se vendent plus vite et plus cher.

#### 1. Un argument de vente majeur
L'absence de factures CIE et la garantie d'une électricité stable sont des arguments irrésistibles pour les acheteurs et les locataires premium.

#### 2. Réduction des charges
Pour un investisseur locatif, le solaire permet de proposer des loyers "charges comprises" très attractifs tout en maximisant la rentabilité nette.

#### 3. Modernité et Écologie
Le label Sunwave Hybrid sur une maison est un gage de modernité technologique et d'engagement environnemental, deux critères de plus en plus recherchés.

#### Conclusion
Ne voyez pas le solaire comme une dépense, mais comme une amélioration de votre capital immobilier.
          `,
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
          date: '2024-02-25',
          category: 'immobilier'
        }
      ]
    };
  }

  public save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  // --- AUTH ---
  register(userData: Omit<User, 'id' | 'date_inscription' | 'derniere_connexion' | 'bonus_solde'>): User {
    const newUser: User = {
      ...userData,
      id: `USR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      date_inscription: new Date().toISOString(),
      derniere_connexion: new Date().toISOString(),
      bonus_solde: 0
    };
    this.state.users.push(newUser);
    this.save();
    this.setSession(newUser);
    return newUser;
  }

  loginByPhone(phone: string): User | null {
    const cleanPhone = phone.replace(/\s/g, '');
    const user = this.state.users.find(u => u.telephone.replace(/\s/g, '').includes(cleanPhone) || cleanPhone.includes(u.telephone.replace(/\s/g, '')));
    if (user) {
      user.derniere_connexion = new Date().toISOString();
      this.save();
      this.setSession(user);
      return user;
    }
    return null;
  }

  adminLogin(phone: string, pass: string): User | null {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone === '22507090001' && pass === 'p@ssword2001') {
      const admin: User = {
        id: 'ADMIN-001',
        nom: 'DIRECTION',
        prenom: 'ADMIN',
        email: 'Sunwavehybrid@gmail.com',
        telephone: '22507090001',
        pays: "Côte d'Ivoire",
        ville: 'Abidjan',
        type_profil: 'pro',
        date_inscription: new Date().toISOString(),
        derniere_connexion: new Date().toISOString(),
        source: 'system',
        role: 'admin',
        bonus_solde: 0
      };
      this.setSession(admin);
      return admin;
    }
    return null;
  }

  checkPhoneExists(phone: string): boolean {
    const cleanPhone = phone.replace(/\s/g, '');
    return this.state.users.some(u => u.telephone.replace(/\s/g, '').includes(cleanPhone) || cleanPhone.includes(u.telephone.replace(/\s/g, '')));
  }

  private setSession(user: any) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }

  logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  // --- ORDERS & PHASES ---
  createOrder(orderData: Omit<Order, 'id' | 'date_commande' | 'statut' | 'phase' | 'payg_code' | 'reste_a_devoir'>): Order {
    const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = { 
        ...orderData, 
        id: newOrderId, 
        date_commande: new Date().toISOString(), 
        statut: 'en_attente_paiement',
        phase: 1, 
        payg_code: `${Math.floor(100000 + Math.random() * 900000)}`,
        reste_a_devoir: orderData.montant_total - orderData.acompte_paye
    };

    this.state.orders.push(newOrder);
    this.save();
    return newOrder;
  }

  updateOrder(orderId: string, updates: Partial<Order>): boolean {
    const index = this.state.orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      const current = this.state.orders[index];
      const updated = { ...current, ...updates };
      
      // Recalculer le reste à devoir si nécessaire
      if (updates.montant_total !== undefined || updates.acompte_paye !== undefined) {
        updated.reste_a_devoir = (updated.montant_total || 0) - (updated.acompte_paye || 0);
      }
      
      this.state.orders[index] = updated;
      this.save();
      return true;
    }
    return false;
  }

  getUserOrders(userId: string): Order[] {
    return this.state.orders.filter(o => o.client_id === userId);
  }

  recordPayment(paymentData: Omit<Payment, 'id' | 'date_paiement' | 'statut'>): Payment {
    const newPayment: Payment = {
      ...paymentData,
      id: `PAY-${Date.now()}`,
      date_paiement: new Date().toISOString(),
      statut: 'valide'
    };
    
    this.state.payments.push(newPayment);
    
    // Update order
    const orderIndex = this.state.orders.findIndex(o => o.id === paymentData.order_id);
    if (orderIndex !== -1) {
      const order = this.state.orders[orderIndex];
      const orderPayments = this.state.payments.filter(p => p.order_id === order.id && p.statut === 'valide');
      
      // If it's the 20th payment (excluding the deposit which is handled separately in montant_total/reste_a_devoir logic usually)
      // Actually, let's just count payments.
      if (orderPayments.length >= 20) {
        order.statut = 'termine';
        order.archived = true;
        order.phase = 3;
      }
      
      order.reste_a_devoir = Math.max(0, (order.reste_a_devoir || 0) - paymentData.montant);
      this.state.orders[orderIndex] = { ...order };
    }
    
    this.save();
    return newPayment;
  }

  getAllOrders() { return this.state.orders; }
  getAllPayments() { return this.state.payments; }
  getAllUsers() { return this.state.users; }
  getAllMessages() { return this.state.messages; }
  getBlogPosts() { return this.state.blogPosts || []; }
  getAllProducts() { return this.state.products; }

  getProductById(id: string): Product | undefined {
    return this.state.products.find(p => p.id === id);
  }

  addMessage(msg: Omit<ContactMessage, 'id' | 'date_envoi' | 'traite'>) {
    const newMsg: ContactMessage = { ...msg, id: `MSG-${Date.now()}`, date_envoi: new Date().toISOString(), traite: false };
    this.state.messages.push(newMsg);
    this.save();
    return newMsg;
  }

  saveSimulation(userId: string, data: any) {
    const sim = {
      id: `SIM-${Date.now()}`,
      userId,
      data,
      date: new Date().toISOString()
    };
    if (!this.state.simulations) this.state.simulations = [];
    this.state.simulations.push(sim);
    this.save();
    return sim;
  }

  getUserSimulations(userId: string) {
    if (!this.state.simulations) return [];
    return this.state.simulations.filter(s => s.userId === userId);
  }
}

export const db = new DatabaseService();
