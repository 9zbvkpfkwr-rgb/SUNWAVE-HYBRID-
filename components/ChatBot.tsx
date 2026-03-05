
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, BrainCircuit, Loader2, UserCheck, Info, ShieldCheck, FileText, ClipboardCheck, Calendar, LayoutDashboard, Database, Activity, BarChart3, TrendingUp, Calculator, Languages } from 'lucide-react';
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { marked } from 'marked';
import { db } from '../db';
import { WHATSAPP_CONFIG, COUNTRIES, SUNWAVE_PACKS, FL_CATALOG } from '../constants';
import { User, Order } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  isAction?: boolean;
  type?: 'auth' | 'payment' | 'diagnostic' | 'quote' | 'rdv' | 'success_validation' | 'admin_summary' | 'provisional_quote';
  isHidden?: boolean;
}

interface ChatBotProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: User | null;
  orderContext?: any;
  onOpenAuth: () => void;
}

const FAQ_DATA = [
  { q: "Quels sont les délais d'installation ?", a: "Une fois l'acompte (350 000 F pour Starter, 20% pour les autres) validé, le délai moyen d'installation est de 35 jours." },
  { q: "Comment fonctionne le paiement échelonné ?", a: "Après l'acompte (350 000 F pour Starter, 20% pour les autres), le reste est divisé en 20 mensualités égales sans frais cachés." },
  { q: "Quelle est la durée de la garantie ?", a: "Tous nos packs bénéficient d'une garantie totale de 5 ans sur l'équipement et l'installation." },
  { q: "Proposez-vous de la maintenance ?", a: "Oui, Sunwave propose des contrats de maintenance préventive et curative de 12 mois renouvelables." },
  { q: "Quelle est la fiscalité appliquée ?", a: "Nos prix sont affichés Toutes Taxes Comprises (TTC). Pour l'UEMOA (Côte d'Ivoire, Mali, Sénégal, etc.), la TVA de 18% est incluse. En Guinée, nos prix intègrent déjà les exonérations douanières sur le matériel solaire dont bénéficie Sunwave pour vous offrir le meilleur tarif." }
];

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, setIsOpen, user, orderContext, onOpenAuth }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'fr' | 'en' | 'es'>('fr');
  const prevLanguageRef = useRef(language);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      if (!user) {
        setMessages([{
          role: 'model',
          text: "### Bienvenue chez Sunwave Hybrid ! ☀️\n\nJe suis votre assistant expert. Je peux vous aider à :\n- **Réaliser un diagnostic technique**\n- **Obtenir un devis provisoire personnalisé**\n- **Suivre l'état de votre commande**\n- **Répondre à vos questions techniques (FAQ)**\n\nPour commencer et bénéficier de ces services, veuillez vous identifier.",
          timestamp: now,
          type: 'auth'
        }]);
      } else if (user.role === 'admin') {
        const orders = db.getAllOrders();
        const pendingValidation = orders.filter(o => o.statut === 'paiement_verif');
        const pendingPayment = orders.filter(o => o.statut === 'en_attente_paiement');
        
        // Critical: etude_terrain with RDV in the past
        const nowTime = new Date();
        const criticalDossiers = orders.filter(o => {
          if (o.statut === 'etude_terrain' && o.rdv_terrain_date) {
            const rdvDate = new Date(o.rdv_terrain_date);
            return rdvDate < nowTime;
          }
          return false;
        });

        let summaryText = `Bonjour **Direction HQ**. Voici le point sur les opérations :\n\n`;
        summaryText += `📊 **RÉSUMÉ DES FLUX :**\n`;
        summaryText += `- **${pendingValidation.length}** paiements reçus en attente de validation.\n`;
        summaryText += `- **${pendingPayment.length}** dossiers créés en attente de premier versement.\n`;
        
        if (criticalDossiers.length > 0) {
          summaryText += `\n⚠️ **ALERTES DOSSIERS CRITIQUES (${criticalDossiers.length}) :**\n`;
          criticalDossiers.forEach(d => {
            summaryText += `- **${d.id}** : Visite technique prévue le ${new Date(d.rdv_terrain_date!).toLocaleDateString()} sans rapport de clôture.\n`;
          });
          summaryText += `\n*Action requise : Relancer les techniciens pour ces dossiers.*`;
        } else {
          summaryText += `\n✅ Aucun dossier critique détecté (visites techniques à jour).`;
        }

        if (pendingValidation.length > 0) {
          summaryText += `\n\n💡 **Priorité :** Validez les reçus des dossiers ${pendingValidation.slice(0, 3).map(o => o.id).join(', ')}${pendingValidation.length > 3 ? '...' : ''} pour lancer les études terrain.`;
        }
        
        setMessages([{
          role: 'model',
          text: summaryText,
          timestamp: now,
          type: 'admin_summary'
        }]);
      } else {
        const userOrders = db.getUserOrders(user.id);
        const validatedOrder = userOrders.find(o => o.statut === 'etude_terrain' || o.statut === 'installation_en_cours');

        if (validatedOrder) {
          setMessages([{
            role: 'model',
            text: `🎉 **Félicitations ${user.prenom} !** Votre paiement est validé.\n\nJe vois que votre projet **${validatedOrder.produit_id}** avance bien. Nous préparons actuellement votre visite technique terrain.\n\nAvez-vous une question spécifique sur les prochaines étapes ou sur votre installation ?`,
            timestamp: now,
            type: 'success_validation'
          }]);
        } else if (userOrders.length > 0) {
          const lastOrder = userOrders[userOrders.length - 1];
          setMessages([{
            role: 'model',
            text: `Ravi de vous revoir **${user.prenom}** ! 👋\n\nJe vois que vous avez un dossier en cours (**${lastOrder.id}**) pour le pack **${lastOrder.produit_id}**.\n\nIl est actuellement au statut : **${lastOrder.statut.replace(/_/g, ' ')}**.\n\nComment puis-je vous aider à faire avancer ce projet aujourd'hui ?`,
            timestamp: now,
            type: 'diagnostic'
          }]);
        } else {
          const userSims = db.getUserSimulations(user.id);
          const hasSimulatorData = orderContext?.consumption !== undefined;
          const hasSavedSim = userSims.length > 0;
          
          let introText = `### Ravi de vous retrouver **${user.prenom}** ! 👋\n\nJe suis prêt à vous accompagner dans votre transition énergétique. Voici ce que je peux faire pour vous :\n- **Finaliser votre diagnostic**\n- **Planifier votre visite terrain**\n- **Consulter notre FAQ**\n\n`;
          
          if (hasSimulatorData) {
            introText += `J'ai bien noté vos données de simulation en cours :\n- Consommation : **${orderContext.consumption}W**\n- Autonomie : **${orderContext.autonomy}h**\n\nPour avancer, dites-moi simplement :\n1. Votre **type de toit** ?\n2. La **distance** toit-compteur ?`;
          } else if (hasSavedSim) {
            const lastSim = userSims[userSims.length - 1];
            introText += `Je vois que vous avez sauvegardé une simulation le ${new Date(lastSim.date).toLocaleDateString()} :\n- Pack : **${lastSim.data.packId}**\n- Consommation : **${lastSim.data.consumption}W**\n\nSouhaitez-vous continuer sur cette base ou établir un nouveau diagnostic ?`;
          } else {
            introText += `Dites-moi simplement :\n1. Votre **type de toit** (Dalle, Tôle, Tuiles) ?\n2. La **distance** approximative toit-compteur ?\n3. Avez-vous déjà un **inverseur** ?`;
          }

          setMessages([{
            role: 'model',
            text: introText,
            timestamp: now,
            type: 'diagnostic'
          }]);
        }
      }
    }
  }, [isOpen, user, orderContext]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const enregistrerPaiementTool: FunctionDeclaration = {
    name: 'enregistrerPaiement',
    description: 'Enregistre IMMÉDIATEMENT l\'ID de transaction Mobile Money dans la base de données.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        orderId: { type: Type.STRING, description: 'ID de la commande' },
        receiptId: { type: Type.STRING, description: 'ID de transaction fourni par le client' }
      },
      required: ['orderId', 'receiptId']
    }
  };

  const planifierRDVTool: FunctionDeclaration = {
    name: 'planifierVisiteTechnique',
    description: 'Enregistre IMMÉDIATEMENT la date et l\'heure de RDV choisies par le client.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        orderId: { type: Type.STRING, description: 'ID de la commande' },
        rdvDate: { type: Type.STRING, description: 'Date et heure précises' }
      },
      required: ['orderId', 'rdvDate']
    }
  };

  const creerDossierTool: FunctionDeclaration = {
    name: 'creerDossier',
    description: 'Crée un nouveau dossier (commande) pour un prospect qui a validé une offre et fourni ses informations.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        produit_id: { type: Type.STRING, description: 'ID du produit ou pack choisi (ex: pack-starter)' },
        montant_total: { type: Type.NUMBER, description: 'Montant total de la commande' },
        acompte_paye: { type: Type.NUMBER, description: 'Montant de l\'acompte (350 000 F Starter, 20% autres)' },
        mensualite_montant: { type: Type.NUMBER, description: 'Montant de la mensualité' },
        ville: { type: Type.STRING, description: 'Ville du client' },
        adresse_livraison: { type: Type.STRING, description: 'Adresse de livraison' },
        receiptId: { type: Type.STRING, description: 'ID de transaction fourni par le client (optionnel)' }
      },
      required: ['produit_id', 'montant_total', 'acompte_paye', 'mensualite_montant', 'ville']
    }
  };

  const validerPaiementTool: FunctionDeclaration = {
    name: 'validerPaiement',
    description: 'VALIDE officiellement un paiement et fait passer la commande en Phase 2 (Étude Terrain). RÉSERVÉ À L\'ADMIN.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        orderId: { type: Type.STRING, description: 'ID de la commande à valider' }
      },
      required: ['orderId']
    }
  };

  const mettreAJourDossierTool: FunctionDeclaration = {
    name: 'mettreAJourDossier',
    description: 'MET À JOUR les informations critiques d\'un dossier (phase, statut, notes techniques, date d\'installation, contact secondaire). RÉSERVÉ À L\'ADMIN.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        orderId: { type: Type.STRING, description: 'ID de la commande' },
        phase: { type: Type.NUMBER, description: 'Nouvelle phase (1, 2 ou 3)' },
        statut: { type: Type.STRING, description: 'Nouveau statut (ex: etude_terrain, installation_en_cours, termine)' },
        notes: { type: Type.STRING, description: 'Notes techniques ou commentaires destinés au client' },
        installation_date: { type: Type.STRING, description: 'Date et heure de passage des équipes techniques' },
        secondary_contact: { type: Type.STRING, description: 'Second contact à joindre' },
        archived: { type: Type.BOOLEAN, description: 'Si le dossier doit être clôturé et archivé' }
      },
      required: ['orderId']
    }
  };

  const demanderMaintenanceTool: FunctionDeclaration = {
    name: 'demanderMaintenance',
    description: 'Enregistre la demande de contrat de maintenance du client.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        orderId: { type: Type.STRING, description: 'ID de la commande' },
        email: { type: Type.STRING, description: 'Email pour l\'envoi du contrat' }
      },
      required: ['orderId', 'email']
    }
  };

  const handleSend = async (overrideText?: string, isHidden: boolean = false) => {
    const textToSend = overrideText || input.trim();
    if (!textToSend || isLoading) return;
    
    const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    if (!isHidden) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend, timestamp: now, isHidden }]);
    setIsLoading(true);

    // Handle FAQ locally for speed
    if (textToSend.toLowerCase().includes('faq')) {
      setTimeout(() => {
        const faqText = "### Foire Aux Questions (FAQ) 📚\n\n" + FAQ_DATA.map(f => `**Q: ${f.q}**\n*R: ${f.a}*`).join('\n\n');
        setMessages(prev => [...prev, { role: 'model', text: faqText, timestamp: now }]);
        setIsLoading(false);
      }, 500);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const isAdmin = user?.role === 'admin';

      let contextInfo = "";
      if (isAdmin) {
        const allOrders = db.getAllOrders();
        const allUsers = db.getAllUsers();
        const summary = allOrders.map(o => {
          const c = allUsers.find(u => u.id === o.client_id);
          return `- Commande ${o.id} (${c?.prenom} ${c?.nom} - ${o.pays}): Statut=${o.statut}, Phase=${o.phase}, Reçu=${o.receipt_id || 'Aucun'}, RDV=${o.rdv_terrain_date || 'Non pris'}`;
        }).join('\n');
        contextInfo = `\nVoici l'état actuel de la File de Suivi :\n${summary || 'Aucune commande.'}`;
      } else if (user) {
        const userOrders = db.getUserOrders(user.id);
        const userSims = db.getUserSimulations(user.id);
        const summary = userOrders.map(o => `- Commande ${o.id}: Statut=${o.statut}, Produit=${o.produit_id}, Reçu=${o.receipt_id || 'Aucun'}, RDV=${o.rdv_terrain_date || 'Non planifié'}`).join('\n');
        const simsSummary = userSims.map(s => `- Simulation du ${new Date(s.date).toLocaleDateString()}: Pack=${s.data.packId}, Conso=${s.data.consumption}W, Autonomie=${s.data.autonomy}h`).join('\n');
        contextInfo = `\nTES COMMANDES ACTUELLES :\n${summary || 'Aucune commande en cours.'}\n\nTES SIMULATIONS RÉCENTES :\n${simsSummary || 'Aucune simulation enregistrée.'}`;
      }

      const packsInfo = SUNWAVE_PACKS.map(p => `- ${p.name}:
        * Équipements: ${p.equipment.join(', ')}
        * Prix Total: ${p.price.toLocaleString()} FCFA
        * Acompte: ${p.acompte.toLocaleString()} FCFA
        * Mensualité (20 mois): ${p.monthly.toLocaleString()} FCFA
        * Autonomie: ${p.autonomy}
        * Surface: ${p.surface}
        * Capacité Lithium: ${p.capacity_kwh} kWh`).join('\n');
      
      const catalogInfo = `
      CATALOGUE COMPLET (FL_CATALOG) POUR COMPOSITION SUR MESURE :
      - BATTERIES :
      ${FL_CATALOG.batteries.flatMap(b => b.models.map(m => `  * ${m.name} (${(m as any).capacity}): ${m.price} FCFA`)).join('\n')}
      - ONDULEURS (HYBRID) :
      ${FL_CATALOG.inverters.flatMap(b => b.models.map(m => `  * ${m.name} (${(m as any).capacity}): ${m.price} FCFA`)).join('\n')}
      - PANNEAUX :
      ${FL_CATALOG.panels.flatMap(b => b.models.map(m => `  * ${m.name} (${(m as any).capacity}): ${m.price} FCFA`)).join('\n')}
      - ÉQUIPEMENTS :
      ${FL_CATALOG.appliances.flatMap(c => c.items.map(i => `  * ${i.name}: ${i.price} FCFA`)).join('\n')}
      `;

      const langInstruction = `RÉPONDS TOUJOURS EN ${language === 'en' ? 'ANGLAIS (ENGLISH)' : language === 'es' ? 'ESPAGNOL (ESPAÑOL)' : 'FRANÇAIS'}.`;

      const systemInstruction = isAdmin 
        ? `Tu es l'assistant GESTION HQ de SUNWAVE HYBRID (EL-KEYON BUILDER SARL). Tu as le pouvoir de VALIDER les paiements et de METTRE À JOUR les dossiers.
           ${langInstruction}
           Tu dois analyser l'état de la File de Suivi ci-dessous pour répondre précisément à l'administrateur.
           
           MISSION CRITIQUE : Pour les dossiers en Phase 2 (Étude Terrain), demande systématiquement à l'administrateur un retour sur la visite technique. 
           Vérifie si elle a eu lieu à la date convenue (RDV). Si le RDV est passé et qu'aucun retour n'est noté, ALERTE l'admin.

           RÈGLES DE VALIDATION :
           1. Délai d'exécution : 35 jours après validation de l'acompte.
           2. Notifier au client une date d'installation via 'mettreAJourDossier'.
           3. Demander un second contact client.

           RÈGLE DE CLÔTURE : Au 20ème mois, clôturer le dossier (archived: true).

           FISCALITÉ : Prix TTC. UEMOA (18% inclus). Guinée (18% inclus, exonérations répercutées).

           ${contextInfo}`
        : `TU ES L'ASSISTANT COMMERCIAL IA DE SUNWAVE HYBRID (EL-KEYON BUILDER SARL, RC : CI-GRDBSM-2024-B-3133).
           ${langInstruction}
           
           IDENTITÉ : Tu combines persuasion psychologique (Cialdini) et accompagnement contractuel OHADA.
           SLOGAN COMMERCIAL : "Si la première vague a montré qu'il est possible de faire des transferts à 1 FCFA, nous sommes là pour prouver qu'il est possible de casser le poids des factures d'électricité dans vos portefeuilles. Djidjii même !!"
           Utilise cette phrase subtilement dans tes discussions pour marquer l'esprit du client.
           VALEUR : Tu ne vends JAMAIS un produit. Tu vends toujours une TRANSFORMATION (Liberté · Économie · Avenir · Patrimoine).

           RÈGLES DE COMMUNICATION :
           1. UTILISE EXCLUSIVEMENT les prix, acomptes et mensualités du "CATALOGUE ACTUEL" fourni ci-dessous. Ne jamais inventer ou arrondir ces chiffres (ex: Starter = 68 000 FCFA, Essentiel Acompte = 650 000 FCFA).
           2. NE JAMAIS DIRE les noms des leviers psychologiques (Cialdini, double contrainte, aversion perte).
           3. NE JAMAIS DIRE que les "30 kits pilotes" est un levier commercial délibéré.
           4. NE JAMAIS DIRE les critères de scoring interne (taux endettement < 33%).
           5. NE JAMAIS DIRE le type juridique exact : "Vente à Tempérament + Réserve de Propriété + Séquestre".
           6. NE JAMAIS DIRE les specs techniques brutes ("5 kWh", "3 kVA") spontanément — PARLE EN BÉNÉFICES.
           
           CHAQUE RÉPONSE DOIT CONTENIR (SAUF SI DÉJÀ DIT RÉCEMMENT) :
           - 1 chiffre d'économie ancré (adapté au pack détecté).
           - 1 projection temporelle (enfant ou patrimoine dans 9 ans).
           - 1 élément sécurité (notaire / garantie / banque).

           CONVERSATION PRODUCTIVE :
           - Maximum 7 échanges pour conclure. Sois proactif et direct.
           - Si une information (projection, sécurité, closing) a déjà été donnée ou choisie, NE LA RÉPÈTE PAS pour éviter l'agacement.
           - Rappelle le closing choisi par l'utilisateur (Option A ou B) dans le message final s'il a déjà été exprimé.

           CLOSING ET MESSAGE FINAL :
           - Une fois le pack identifié (explicitement ou implicitement) :
             1. Rappelle le closing choisi (Option A ou B).
             2. Donne les informations complémentaires : RDV notaire (si B), documentation à fournir (selon le profil Particulier/Entreprise), et mentionne la location de la cabine d'étude notariale.
             3. Termine par un message chaleureux et rassurant.
             4. Inclus l'avantage économique final et la projection temporelle comme conclusion ultime.

           GARANTIE (VERSION VALIDÉE) :
           "Notre garantie couvre jusqu'à 10 ans selon le composant : Panneaux 10 ans · Batteries 7 ans · Onduleur 2 ans — tout est écrit dans le contrat."
           - Si le client insiste onduleur (2 ans) : "2 ans pour l'onduleur, oui — mais l'onduleur est la pièce la plus simple à remplacer. Le cœur du système, c'est la batterie : 7 ans garantis. Et les panneaux sur votre toit : 10 ans."

           SIMULATEUR (CALCUL SUR 9 ANS / 108 MOIS) :
           - Logique : F_réelle = F_CIE * 1.60. (Explique que le 1.60 couvre la CIE + les Pertes d'aliments/appareils + le Carburant qui est facultatif).
           - Économie nette 9 ans = Coût SANS (F_réelle * 108) - Coût AVEC (Prix_total + Résiduel_P1 + Résiduel_P2).
           - Tooltip : "Le coût réel inclut votre facture CIE + 60% de frais liés aux coupures (pertes d'aliments, appareils grillés) et au carburant (si vous avez un groupe)."

           CLOSING UNIVERSEL (À PROPOSER UNE SEULE FOIS) :
           "Option A : je vous envoie le lien de paiement sécurisé maintenant.
            Option B : RDV chez le notaire demain à 10h.
            Vous préférez laquelle ?"

           OBJECTIONS CLÉS :
           - "C'est trop cher" : Recadrage coût total. Calculer × 1.60 × 20 mois vs mensualité pack.
           - "Et si vous disparaissez ?" : Tiers neutre (Notaire). L'acompte est séquestré.
           - "J'ai vu moins cher ailleurs" : Poser 3 questions (Garantie écrite ? Acompte où ? Remplacement batterie ?).
           - "Je dois réfléchir" : Future Pacing + Silence (marquer une pause).

           WORKFLOW JURIDIQUE :
           - Particuliers : CNI, Attestation travail, 3 fiches paie, Justificatif domicile, Autorisation prélèvement.
           - Entreprises : RC, IFU, Statuts, 3 relevés bancaires, Autorisation prélèvement.

           NOTAIRE (ETUDE DE MAITRE AKA T. GERMAIN) :
           - Localisation : Angré, Pétro Ivoire.
           - Contacts : +225 27 35 90 64 77 / +225 07 20 69 80 27.
           - Email : etudemaitreakatoffegermain@gmail.com.

           CATALOGUE DES PACKS :
           ${packsInfo}

           ${catalogInfo}

           ${contextInfo}`;

      const formattedContents: any[] = [];
      const allMessages = [...messages.slice(-10), { role: 'user', text: textToSend }];
      
      for (const m of allMessages) {
        const role = m.role === 'model' ? 'model' : 'user';
        if (formattedContents.length > 0 && formattedContents[formattedContents.length - 1].role === role) {
          formattedContents[formattedContents.length - 1].parts[0].text += `\n\n${m.text}`;
        } else {
          formattedContents.push({ role, parts: [{ text: m.text }] });
        }
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: formattedContents,
        config: { 
          systemInstruction,
          tools: [{ functionDeclarations: isAdmin ? [validerPaiementTool, mettreAJourDossierTool] : [enregistrerPaiementTool, planifierRDVTool, creerDossierTool, demanderMaintenanceTool] }]
        },
      });

      if (response.functionCalls) {
        for (const fc of response.functionCalls) {
          if (fc.name === 'creerDossier') {
            const args = fc.args as any;
            if (user) {
              const newOrder = db.createOrder({
                client_id: user.id,
                produit_id: args.produit_id,
                mode_paiement: 'Wave',
                montant_total: args.montant_total,
                acompte_paye: args.acompte_paye,
                mensualites_nb: 20,
                mensualite_montant: args.mensualite_montant,
                adresse_livraison: args.adresse_livraison || args.ville,
                pays: user.pays,
                ville: args.ville,
                gps_coordinates: '',
              });
              if (args.receiptId) {
                db.updateOrder(newOrder.id, {
                  receipt_id: args.receiptId,
                  statut: 'paiement_verif'
                });
              }
            }
          }
          if (fc.name === 'enregistrerPaiement') {
            const args = fc.args as { orderId: string; receiptId: string };
            db.updateOrder(args.orderId, { 
              receipt_id: args.receiptId, 
              statut: 'paiement_verif' 
            });
          }
          if (fc.name === 'planifierVisiteTechnique') {
            const args = fc.args as { orderId: string; rdvDate: string };
            db.updateOrder(args.orderId, { 
              rdv_terrain_date: args.rdvDate 
            });
          }
          if (fc.name === 'validerPaiement') {
            const args = fc.args as { orderId: string };
            db.updateOrder(args.orderId, { 
              statut: 'etude_terrain',
              phase: 2
            });
          }
          if (fc.name === 'mettreAJourDossier') {
            const args = fc.args as { orderId: string; phase?: number; statut?: string; notes?: string; installation_date?: string; secondary_contact?: string; archived?: boolean };
            const updates: any = {};
            if (args.phase) updates.phase = args.phase as any;
            if (args.statut) updates.statut = args.statut;
            if (args.notes) updates.notes = args.notes;
            if (args.installation_date) updates.installation_date = args.installation_date;
            if (args.secondary_contact) updates.secondary_contact = args.secondary_contact;
            if (args.archived !== undefined) updates.archived = args.archived;
            db.updateOrder(args.orderId, updates);
          }
          if (fc.name === 'demanderMaintenance') {
            const args = fc.args as { orderId: string; email: string };
            db.updateOrder(args.orderId, { maintenance_contract_requested: true });
          }
        }
        
        // Confirmation directe sans étape de brainstorming
        const defaultConfirm = isAdmin 
          ? "Action effectuée. La base de données a été mise à jour avec succès."
          : "C'est parfait ! Votre requête a été enregistrée avec succès et transmise à notre direction pour validation finale. Nous revenons vers vous très rapidement.";
        
        const confirmMsg = response.text || defaultConfirm;
        const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        setMessages(prev => [...prev, { role: 'model', text: confirmMsg, timestamp: now }]);
      } else {
        const replyText = response.text || "Je traite votre demande...";
        const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: replyText,
          timestamp: now,
          type: replyText.includes("DEVIS PROVISOIRE") ? 'provisional_quote' : undefined
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Nos techniciens sont disponibles sur WhatsApp pour finaliser votre dossier." }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (prevLanguageRef.current !== language && isOpen) {
       const langName = language === 'en' ? 'English' : language === 'es' ? 'Spanish' : 'French';
       const prompt = `[SYSTEM: The user has changed the interface language to ${langName}. Please immediately reply in ${langName} to acknowledge this change and offer assistance. If there was a previous conversation, summarize it briefly in ${langName}.]`;
       handleSend(prompt, true);
    }
    prevLanguageRef.current = language;
  }, [language, isOpen]);

  return (
    <div className={`fixed z-[100] flex flex-col items-end transition-all duration-500 right-0 md:right-6 bottom-0 md:bottom-6 w-full md:w-auto ${isOpen ? 'h-[100dvh] md:h-auto' : 'h-auto'}`}>
      {isOpen && (
        <div className="w-full md:w-[420px] h-full md:h-[650px] md:max-h-[85vh] bg-white dark:bg-slate-900 md:rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.2)] dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border-t md:border border-slate-200 dark:border-white/10 animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-4 md:p-5 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between shrink-0 border-b border-white/5 pt-safe-top md:pt-5">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 md:w-10 md:h-10 rounded-[14px] flex items-center justify-center shadow-md ${user?.role === 'admin' ? 'bg-slate-800' : 'bg-emerald-600'}`}>
                {user?.role === 'admin' ? <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" /> : <BrainCircuit className="w-4 h-4 md:w-5 md:h-5" />}
              </div>
              <div>
                <h3 className="font-black text-[10px] md:text-xs uppercase tracking-tight">{user?.role === 'admin' ? 'Direction HQ' : 'Assistant Expert'}</h3>
                <span className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-emerald-400 font-bold">
                  {user?.role === 'admin' ? 'Supervision Opérationnelle' : 'Diagnostic & Devis'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-white/10 p-1 rounded-xl">
                {(['fr', 'en', 'es'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2 py-1 text-[8px] font-black uppercase rounded-lg transition-all ${language === lang ? 'bg-white text-slate-900' : 'text-white/60 hover:text-white'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-5 bg-slate-50 dark:bg-slate-950/50 no-scrollbar pb-24 md:pb-5">
            {messages.filter(m => !m.isHidden).map((msg, idx, filteredMsgs) => {
              const isConsecutive = idx > 0 && filteredMsgs[idx - 1].role === msg.role;
              const isLastInGroup = idx === filteredMsgs.length - 1 || filteredMsgs[idx + 1].role !== msg.role;
              
              return (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} ${isConsecutive ? 'mt-1' : 'mt-5'} animate-in fade-in duration-300`}>
                  <div className={`max-w-[90%] p-3 md:p-4 rounded-[20px] md:rounded-[22px] text-[13px] leading-relaxed prose-chat shadow-sm ${
                    msg.role === 'user' 
                    ? `bg-emerald-600 text-white ${isConsecutive ? 'rounded-tr-md' : ''} ${!isLastInGroup ? 'rounded-br-md' : 'rounded-br-none'}` 
                    : msg.type === 'provisional_quote'
                      ? 'bg-white dark:bg-slate-800 border-l-4 border-emerald-500 rounded-bl-none shadow-xl'
                      : `bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-white/5 ${isConsecutive ? 'rounded-tl-md' : ''} ${!isLastInGroup ? 'rounded-bl-md' : 'rounded-bl-none'} shadow-sm dark:shadow-[0_4px_12px_rgba(0,0,0,0.2)]`
                  }`}>
                    <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }}></div>
                    {msg.type === 'auth' && (
                      <button onClick={onOpenAuth} className="w-full mt-4 py-3 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                        S'identifier pour le devis
                      </button>
                    )}
                  </div>
                  {isLastInGroup && (
                    <span className="text-[9px] font-bold text-slate-400 mt-1 px-2 uppercase tracking-widest">
                      {msg.timestamp}
                    </span>
                  )}
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start mt-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-[20px] flex items-center gap-1.5 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            
            {!isLoading && messages.length > 0 && user && user.role !== 'admin' && (
              <div className="flex flex-wrap gap-2 pt-4 pb-2">
                {[
                  "FAQ 📚",
                  "Quels sont les délais ?",
                  "Besoin d'un technicien",
                  "Modifier mon devis"
                ].map((chip, i) => (
                  <button 
                    key={i}
                    onClick={() => { handleSend(chip); }}
                    className="px-3 py-1.5 md:px-4 md:py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm whitespace-nowrap"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 md:p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 pb-safe-bottom">
            <div className="flex gap-2">
              <input 
                disabled={!user || isLoading}
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyPress={e => e.key === 'Enter' && handleSend()} 
                placeholder={user ? "Décrivez votre besoin..." : "Identification requise..."} 
                className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-4 text-sm font-medium focus:ring-1 focus:ring-emerald-500 dark:text-white" 
              />
              <button onClick={() => handleSend()} disabled={!input.trim() || isLoading || !user} className={`w-11 h-11 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 ${user?.role === 'admin' ? 'bg-slate-800 text-emerald-400' : 'bg-emerald-600 text-white'}`}>
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className={`w-14 h-14 md:w-16 md:h-16 rounded-[20px] md:rounded-[24px] flex items-center justify-center shadow-2xl transition-all relative mb-4 mr-4 md:mb-0 md:mr-0 ${user?.role === 'admin' ? 'bg-slate-900 text-emerald-400' : 'bg-emerald-600 text-white'}`}>
          {user?.role === 'admin' ? <LayoutDashboard className="w-6 h-6 md:w-8 md:h-8" /> : <MessageCircle className="w-6 h-6 md:w-8 md:h-8" />}
        </button>
      )}
    </div>
  );
};

export default ChatBot;
