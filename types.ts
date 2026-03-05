
export enum PackGamme {
  STARTER = 'Starter',
  ESSENTIEL = 'Essentiel',
  FAMILLE = 'Famille',
  PRO = 'Pro'
}

export interface Product {
  id: string;
  gamme: PackGamme;
  name: string;
  price: number;
  acompte: number;
  monthly: number;
  mensualites_nb: number;
  surface: string;
  autonomy: string;
  equipment: string[];
  warranty: string;
  capacity_kwh: number;
  max_power: number;
  image_url: string;
  stock: number;
  isBestSeller?: boolean;
  isPopular?: boolean;
  active: boolean;
}

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  pays: "Côte d'Ivoire" | "Mali" | "Burkina Faso" | "Sénégal" | "Guinée";
  ville: string;
  quartier?: string;
  type_profil: 'particulier' | 'pro';
  entreprise_nom?: string;
  entreprise_rccm?: string;
  entreprise_ncc?: string;
  date_inscription: string;
  derniere_connexion: string;
  source: string;
  role?: 'admin' | 'client';
  referred_by?: string;
  bonus_solde?: number;
  idu?: string;
  ncc?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: 'actualités' | 'conseils' | 'technologie' | 'juridique' | 'immobilier';
}

// Phases d'installation pour le suivi client/admin
export type InstallationPhase = 1 | 2 | 3; // 1: Paiement/Validation, 2: Étude Terrain, 3: Installation

export type OrderStatus = 'en_attente_paiement' | 'paiement_verif' | 'etude_terrain' | 'installation_en_cours' | 'termine' | 'annule';
export type PaymentMode = 'Wave' | 'MTN' | 'Carte' | 'Espèces' | 'Orange Money';

export interface Order {
  id: string;
  client_id: string;
  produit_id: string;
  date_commande: string;
  statut: OrderStatus;
  phase: InstallationPhase;
  mode_paiement: PaymentMode;
  montant_total: number;
  acompte_paye: number;
  mensualites_nb: number;
  mensualite_montant: number;
  adresse_livraison: string;
  pays: string;
  ville: string;
  gps_coordinates?: string;
  payg_code?: string;
  receipt_id?: string;
  rdv_terrain_date?: string;
  diagnostic_infos?: any;
  reste_a_devoir?: number;
  notes?: string;
  archived?: boolean;
  secondary_contact?: string;
  maintenance_contract_requested?: boolean;
  installation_date?: string;
  retour_terrain?: string;
}

// Payment interface for financial tracking and history
export interface Payment {
  id: string;
  order_id: string;
  client_id: string;
  montant: number;
  date_paiement: string;
  mode: PaymentMode;
  statut: 'en_attente' | 'valide' | 'rejete';
  recu_numero?: string;
}

export interface ContactMessage {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  message: string;
  date_envoi: string;
  traite: boolean;
  ai_automated?: boolean;
  ai_response?: string;
}

export interface Appliance {
  id: string;
  name: string;
  power: number;
  icon: string;
  category?: 'eco' | 'confort' | 'intensif';
}
