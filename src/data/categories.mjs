// The category vocabulary for the directory. Each vendor's `categories` in
// vendors.json should use one of these labels (add a new one here if you need it).
// `icon` is shown on chips and badges; `order` controls the filter-chip order
// (lower = earlier). Categories not listed still work — they just sort last.

export const CATEGORIES = {
  'Plumber':            { icon: '🚰', order: 1 },
  'Handyman':           { icon: '🧰', order: 2 },
  'Electrician':        { icon: '💡', order: 3 },
  'Gardener':           { icon: '🌿', order: 4 },
  'Cleaner':            { icon: '🧽', order: 5 },
  'Radiant Heat':       { icon: '♨️', order: 6 },
  'Arborist':           { icon: '🌳', order: 7 },
  'Windows & Glass':    { icon: '🪟', order: 8 },
  'Concrete':           { icon: '🧱', order: 9 },
  'General Contractor': { icon: '🏗️', order: 10 },
  'HVAC':               { icon: '🌡️', order: 11 },
  'Water Softener':     { icon: '💧', order: 12 },
  'Flooring':           { icon: '🪵', order: 13 },
  'Kitchen Reface':     { icon: '🍽️', order: 14 },
  'Countertops':        { icon: '🍳', order: 15 },
  'Product Provider':   { icon: '📦', order: 16 },
  'Auto Repair':        { icon: '🚗', order: 17 },
  'Babysitter & Helper':{ icon: '🧸', order: 18 },
};

export const iconFor = (label) => CATEGORIES[label]?.icon || '🔧';
export const orderFor = (label) => CATEGORIES[label]?.order ?? 999;
