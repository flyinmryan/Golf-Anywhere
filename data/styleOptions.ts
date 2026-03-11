import { Mountain, Shovel, Flag, Sparkles } from 'lucide-react';

export const STYLE_PRINCIPLES = [
  {
    id: 'terrain',
    label: 'Terrain & Layout',
    icon: Mountain,
    options: ['Rolling Hills', 'Flat Plateau', 'Dense Forest', 'Coastal Bluffs', 'Arid Desert', 'Wetland Oasis', 'Canyon Edge']
  },
  {
    id: 'bunkering',
    label: 'Bunkering Style',
    icon: Shovel,
    options: ['Frayed Edge', 'Deep Pot Bunkers', 'Geometric', 'Flash-Faced', 'Waste Areas', 'Grass Hollows', 'Church Pews']
  },
  {
    id: 'greens',
    label: 'Greens & Hazards',
    icon: Flag,
    options: ['Tiered Greens', 'Island Green', 'Infinity Edge', 'Punchbowl', 'Rock Outcroppings', 'Winding Stream', 'Hidden Pond']
  },
  {
    id: 'aesthetic',
    label: 'Course Aesthetic',
    icon: Sparkles,
    options: ['Augusta Lush', 'St. Andrews Rugged', 'Arizona Desert', 'Pacific Coastal', 'Tropical Paradise', 'Modern Minimalist', 'Golden Age']
  }
];

export const STYLES = [
  {
    category: "Inland Designs",
    items: [
      {
        id: 'parkland',
        label: 'Parkland',
        desc: 'Lush green fairways, mature trees, and manicured hazards',
        img: 'public/images/optimized/inland/parkland.jpg'
      },
      {
        id: 'sandbelt',
        label: 'Sandbelt',
        desc: 'Firm, fast turf with bold, rugged bunkering cut into the greens',
        img: 'public/images/optimized/inland/sandbelt.jpg'
      },
      {
        id: 'heathland',
        label: 'Heathland',
        desc: 'Inland links-style with purple heather, gorse, and sandy soil',
        img: 'public/images/optimized/inland/heathland.jpg'
      }
    ]
  },
  {
    category: "Coastal Designs",
    items: [
      {
        id: 'links',
        label: 'Traditional Links',
        desc: 'Wind-swept dunes, deep pot bunkers, and no trees',
        img: 'public/images/optimized/coastal/links.jpg'
      },
      {
        id: 'coastal-cliff',
        label: 'Coastal Cliff',
        desc: 'Dramatic holes played along the edge of ocean precipices',
        img: 'public/images/optimized/coastal/cliffs.jpg'
      },
      {
        id: 'tropical',
        label: 'Tropical Resort',
        desc: 'Pristine white sand, turquoise water hazards, and palm trees',
        img: 'public/images/optimized/coastal/tropical.jpg'
      }
    ]
  },
  {
    category: "Arid & Desert",
    items: [
      {
        id: 'desert-target',
        label: 'Desert Target',
        desc: 'Emerald green fairways contrasting with harsh desert scrub',
        img: 'public/images/optimized/arid/desert.jpg'
      },
      {
        id: 'canyon-wash',
        label: 'Canyon Wash',
        desc: 'Holes that weave through natural rock formations and dry washes',
        img: 'public/images/optimized/arid/canyon.jpg'
      }
    ]
  }
];

export const LUCKY_PROMPTS = [
  "A 17th hole island green surrounded by calm turquoise water",
  "A links course at sunset with long shadows over deep pot bunkers",
  "A majestic par 5 playing directly towards a snow-capped mountain range",
  "A lush parkland course with a historic stone bridge over a small creek"
];
