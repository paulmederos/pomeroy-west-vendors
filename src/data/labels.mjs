// Human-readable labels for the cryptic codes in the source spreadsheet.
// These are stable; the import script only fetches the vendor rows and applies
// these maps. If Mark adds a brand-new code in the Sheet, add it here too — the
// import script will warn about any code it can't expand.

// Vendor category ("Type" column). `icon` is a single emoji used in the UI.
export const CATEGORIES = {
  PLU: { label: 'Plumber', icon: '🚰' },
  HAN: { label: 'Handyman', icon: '🧰' },
  ELE: { label: 'Electrician', icon: '💡' },
  GAR: { label: 'Gardener', icon: '🌿' },
  CLE: { label: 'Cleaner', icon: '🧽' },
  RAD: { label: 'Radiant Heat', icon: '♨️' },
  ARB: { label: 'Arborist', icon: '🌳' },
  WIN: { label: 'Windows & Glass', icon: '🪟' },
  CON: { label: 'Concrete', icon: '🧱' },
  GEN: { label: 'General Contractor', icon: '🏗️' },
  HVA: { label: 'HVAC', icon: '🌡️' },
  SOF: { label: 'Water Softener', icon: '💧' },
  FLO: { label: 'Flooring', icon: '🪵' },
  KIT: { label: 'Kitchen Reface', icon: '🍽️' },
  KRF: { label: 'Kitchen Reface', icon: '🍽️' }, // alias seen in source data
  COU: { label: 'Countertops', icon: '🍳' },
  PRO: { label: 'Product Provider', icon: '📦' },
};

// Service tags ("Services" column).
export const SERVICES = {
  APP: 'Install appliances',
  CCR: 'Seal concrete cracks',
  CFL: 'Clean floors',
  CLB: 'Change light bulbs',
  CPL: 'Polish concrete',
  CRC: 'Driveway / curb smoothing',
  CRP: 'Concrete repair (atrium floor)',
  CTP: 'Countertop replacement',
  DRA: 'Drain cleaning',
  DVC: 'Dryer vent cleaning',
  EIC: 'Eichler home specialist',
  EVC: 'EV charger install',
  EXF: 'Bathroom exhaust fan',
  FEN: 'Fence work',
  FLR: 'Flooring replacement',
  FUS: 'Electric fuse replacement',
  HEA: 'Water heater',
  HYD: 'Hydro jetting',
  INL: 'Install lights',
  INS: 'Insect mesh screens',
  IRR: 'Irrigation install',
  KRF: 'Kitchen cabinet reface',
  LEA: 'Fix leaks',
  LLV: 'Low-voltage lighting',
  MBL: 'Lawn & plant care',
  MHP: 'Mini-split heat pump',
  OUT: 'Outlet / minor electrical',
  PIP: 'Plumbing pipes',
  RAN: 'Radiant heat servicing',
  REP: 'General repairs',
  REPAP: 'Appliance repair',
  ROS: 'Reverse osmosis',
  SEW: 'Sewer backup',
  SHR: 'Sheetrock repair',
  SLV: 'Assemble shelving',
  SOF: 'Install water softener',
  SPL: 'Electric sub-panel',
  TAN: 'Tankless water heater',
  TLT: 'Toilet replacement',
  TOI: 'Toilet work',
  TRE: 'Trenchless sewer repair',
  TREEA: 'Tree trimming',
  FRUIT: 'Fruit tree specialist',
  WFL: 'Whole-house water filter',
  WHC: 'Windows + floors cleaning',
  WHE: 'Water heater',
  WIN: 'Windows & glass doors',
  WRP: 'Wood / siding repair',
  BSM: 'Metal backsplash',
  HAN: 'General handyman',
  ATR: 'Atrium cover',
  CCP: 'Countertops (slab/granite)',
};

// Display order for category filter chips (most-common / most-requested first).
export const CATEGORY_ORDER = [
  'PLU', 'HAN', 'ELE', 'GAR', 'CLE', 'RAD', 'ARB', 'WIN',
  'CON', 'GEN', 'HVA', 'SOF', 'KIT', 'FLO', 'COU', 'PRO',
];
