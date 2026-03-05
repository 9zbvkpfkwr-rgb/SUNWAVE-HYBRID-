
import { Product, PackGamme, Appliance } from './types';

export const COUNTRIES = [
  { 
    name: "Côte d'Ivoire", 
    code: "CI", 
    dial: "+225", 
    flag: "🇨🇮",
    cities: ["Abidjan", "Bouaké", "San Pedro", "Yamoussoukro", "Korhogo"],
    ussd: "*133# (Wave) / *121# (Orange)"
  },
  { 
    name: "Mali", 
    code: "ML", 
    dial: "+223", 
    flag: "🇲🇱",
    cities: ["Bamako", "Kayes", "Mopti", "Ségou", "Sikasso"],
    ussd: "*123# (Orange Money)"
  },
  { 
    name: "Burkina Faso", 
    code: "BF", 
    dial: "+226", 
    flag: "🇧🇫",
    cities: ["Ouagadougou", "Bobo-Dioulasso", "Koudougou"],
    ussd: "*144# (Orange Money)"
  },
  { 
    name: "Sénégal", 
    code: "SN", 
    dial: "+221", 
    flag: "🇸🇳",
    cities: ["Dakar", "Thiès", "Saint-Louis", "Ziguinchor"],
    ussd: "*144# (Orange Money)"
  },
  { 
    name: "Guinée", 
    code: "GN", 
    dial: "+224", 
    flag: "🇬🇳",
    cities: ["Conakry", "Kindia", "Labé", "Kankan"],
    ussd: "*144# (Orange Money)"
  }
];

export const WHATSAPP_CONFIG = {
  CI: {
    number: "2250711771097",
    display: "07 11 77 10 97",
    link: "https://wa.me/2250711771097",
    bank: "Banque Atlantique CI - RIB: CI034 01001 001234567890 12",
    mobile_networks: ["Wave", "Orange Money", "MTN MoMo"]
  },
  ML: {
    number: "22360850256",
    display: "+223 60 85 02 56 (WhatsApp)",
    link: "https://wa.me/22360850256",
    bank: "BDM SA Mali - RIB: ML016 01201 000123456789 01",
    mobile_networks: ["Orange Money", "Moov Money"]
  },
  BF: {
    number: "22670850256",
    display: "70 85 02 56",
    link: "https://wa.me/22670850256",
    bank: "Coris Bank BF - RIB: BF058 01101 001122334455 66",
    mobile_networks: ["Orange Money", "Moov Money"]
  },
  SN: {
    number: "22177850256",
    display: "77 85 02 56",
    link: "https://wa.me/22177850256",
    bank: "CBAO Sénégal - RIB: SN012 01501 123456789012 34",
    mobile_networks: ["Wave", "Orange Money", "Free Money"]
  },
  GN: {
    number: "22462850256",
    display: "62 85 02 56",
    link: "https://wa.me/22462850256",
    bank: "Ecobank Guinée - RIB: GN068 01001 012345678901 23",
    mobile_networks: ["Orange Money"]
  }
};

export const SUNWAVE_PACKS: Product[] = [
  {
    id: 'pack-starter',
    name: 'Pack Starter',
    gamme: PackGamme.STARTER,
    price: 1710000,
    acompte: 350000,
    monthly: 68000,
    mensualites_nb: 20,
    surface: '50-75 M2',
    autonomy: '8-12h/jour',
    equipment: ['Onduleur 3 kVA', 'Batterie 3 kWh', '3×580W Panneaux', 'Surface 50-75 m²'],
    warranty: 'jusqu\'à 10 ans',
    capacity_kwh: 3.0,
    max_power: 1000,
    image_url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d',
    stock: 100,
    isPopular: true,
    active: true
  },
  {
    id: 'pack-essentiel',
    name: 'Pack Essentiel',
    gamme: PackGamme.ESSENTIEL,
    price: 3250000,
    acompte: 650000,
    monthly: 130000,
    mensualites_nb: 20,
    surface: '100-150 M2',
    autonomy: '12-18h/jour',
    equipment: ['Onduleur 6 kVA', 'Batterie 10 kWh', '6×580W Panneaux', 'Surface 100-150 m²'],
    warranty: 'jusqu\'à 10 ans',
    capacity_kwh: 10.0,
    max_power: 3000,
    image_url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d',
    stock: 50,
    active: true
  },
  {
    id: 'pack-famille',
    name: 'Pack Famille',
    gamme: PackGamme.FAMILLE,
    price: 4375000,
    acompte: 875000,
    monthly: 175000,
    mensualites_nb: 20,
    surface: '200-300 M2',
    autonomy: '18-24h/jour',
    equipment: ['Onduleur 8 kVA', 'Batterie 15 kWh', '9×580W Panneaux', 'Surface 200-300 m²'],
    warranty: 'jusqu\'à 10 ans',
    capacity_kwh: 15.0,
    max_power: 5000,
    image_url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d',
    stock: 30,
    isBestSeller: true,
    active: true
  },
  {
    id: 'pack-pro',
    name: 'Pack Pro',
    gamme: PackGamme.PRO,
    price: 6750000,
    acompte: 1350000,
    monthly: 270000,
    mensualites_nb: 20,
    surface: '400-600 M2',
    autonomy: '24-28h/jour',
    equipment: ['Onduleur 12 kVA', 'Batterie 25 kWh', '12×600W Panneaux', 'Surface 400-600 m²'],
    warranty: 'jusqu\'à 10 ans',
    capacity_kwh: 25.0,
    max_power: 10000,
    image_url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d',
    stock: 15,
    active: true
  }
];

export const FL_CATALOG = {
  batteries: [
    {
      brand: 'Sunwave Power Lithium',
      models: [
        { name: 'Lithium 5kWh', price: 690000, capacity: '5kWh', warranty: '5 ans' },
        { name: 'Lithium 10kWh', price: 1250000, capacity: '10kWh', warranty: '5 ans' },
        { name: 'Lithium 20kWh', price: 2350000, capacity: '20kWh', warranty: '5 ans' }
      ]
    }
  ],
  inverters: [
    {
      brand: 'Sunwave Hybrid Volt',
      models: [
        { name: 'Hybrid 5kW', price: 590000, capacity: '5kW', warranty: '3 ans' },
        { name: 'Hybrid 10kW', price: 950000, capacity: '10kW', warranty: '3 ans' },
        { name: 'Hybrid 15kW', price: 1390000, capacity: '15kW', warranty: '3 ans' }
      ]
    }
  ],
  panels: [
    {
      brand: 'Sunwave Solar Beam',
      models: [
        { name: 'Panneau 300Wc', price: 65000, capacity: '300Wc', warranty: '10 ans' },
        { name: 'Panneau 550Wc', price: 115000, capacity: '550Wc', warranty: '10 ans' }
      ]
    }
  ],
  appliances: [
    {
      category: 'Équipements Éco',
      items: [
        { name: 'TV Smart 32" Solaire', price: 195000, warranty: '2 ans' },
        { name: 'Frigo Inverter A++', price: 305000, warranty: '2 ans' }
      ]
    }
  ]
};

export const APPLIANCES: Appliance[] = [
  { id: 'tv', name: 'Télévision Smart', power: 80, icon: '📺', category: 'eco' },
  { id: 'fan', name: 'Ventilateur Inverter', power: 45, icon: '🌀', category: 'eco' },
  { id: 'fridge', name: 'Réfrigérateur A+', power: 120, icon: '❄️', category: 'confort' },
  { id: 'bulb', name: 'Ampoule LED', power: 10, icon: '💡', category: 'eco' },
  { id: 'pc', name: 'Ordinateur Portable', power: 65, icon: '💻', category: 'eco' },
  { id: 'aircon', name: 'Climatiseur 1 CV', power: 1200, icon: '🌬️', category: 'intensif' },
  { id: 'washing', name: 'Lave-linge A+++', power: 2200, icon: '🧺', category: 'intensif' },
  { id: 'freezer', name: 'Congélateur', power: 200, icon: '🧊', category: 'confort' },
  { id: 'microwave', name: 'Micro-ondes', power: 800, icon: '🍲', category: 'confort' },
  { id: 'blender', name: 'Mixeur / Blender', power: 400, icon: '🥤', category: 'eco' }
];

export const WHATSAPP_NUMBER = WHATSAPP_CONFIG.CI.number;
export const WHATSAPP_LINK = WHATSAPP_CONFIG.CI.link;
