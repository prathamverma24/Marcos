export type DetailSection = {
  title: string
  body?: string[]
  groups?: Array<{
    title: string
    items: string[]
  }>
}

export type Product = {
  slug: string
  title: string
  shortTitle: string
  category: string
  image: string
  summary: string
  details: string
  link: string
  benefits: string[]
  useCases: string[]
  detailSections: DetailSection[]
}

export const services = [
  {
    title: 'Industrial Solutions',
    category: 'Industrial',
    summary:
      'Advanced water treatment systems designed for large-scale industrial operations with high capacity requirements.',
    details:
      'Industrial solutions cover RO, ETP, STP, and process water needs for facilities that require dependable output and service support.',
    link: '#products',
  },
  {
    title: 'Commercial Solutions',
    category: 'Commercial',
    summary:
      'Professional water purification for commercial establishments including offices, malls, and hospitality sectors.',
    details:
      'Commercial systems help properties maintain consistent treated water quality for guests, staff, equipment, and daily operations.',
    link: '#products',
  },
  {
    title: 'Domestic Solutions',
    category: 'Domestic',
    summary:
      'Affordable and efficient water treatment systems for homes and residential complexes ensuring pure drinking water.',
    details:
      'Domestic solutions include softeners, purification support, and practical system recommendations for homes and housing communities.',
    link: '#contact',
  },
]

export const products: Product[] = [
  {
    slug: 'ro-plant',
    title: 'RO Plant System',
    shortTitle: 'RO Plant / UF',
    category: 'RO / UF',
    image: '/images/ro-plant-2-D7S_1N_i.jpg',
    summary: 'Advanced Reverse Osmosis purification systems',
    details:
      'Industrial and commercial RO plant systems designed for high-quality, low TDS water across multiple production capacities.',
    link: '#product-explainer',
    benefits: [
      'High-quality purification with advanced membrane technology',
      'Efficient removal of dissolved solids, bacteria, and viruses',
      'Low water wastage with optimized recovery rates',
      'Durable and long-lasting components',
      'Easy maintenance and user-friendly operation',
      'Energy-efficient design',
    ],
    useCases: [
      'Drinking water purification',
      'Hospitals and healthcare facilities',
      'Hotels and restaurants',
      'Manufacturing plants',
      'Pharmaceutical industries',
      'Food and beverage processing',
      'Sea water desalination',
    ],
    detailSections: [
      {
        title: 'Commercial RO System',
        body: [
          'The process of commercial and industrial reverse osmosis provides very high quality water for a variety of uses. From drinking water consumption to sea water desalination, reverse osmosis is widely used in homes and industry where high quality, low TDS water is required. Depending on the specific requirements, reverse osmosis (RO) commercial systems are available in many production capacities.',
        ],
      },
      {
        title: 'Applications',
        groups: [
          {
            title: 'Residential Applications',
            items: ['Drinking water purification', 'Domestic water supply', 'Kitchen water filters'],
          },
          {
            title: 'Commercial & Industrial Applications',
            items: [
              'Hospitals and healthcare facilities',
              'Hotels and restaurants',
              'Manufacturing plants',
              'Pharmaceutical industries',
              'Food and beverage processing',
              'Sea water desalination',
            ],
          },
        ],
      },
      {
        title: 'Technical Specifications',
        groups: [
          {
            title: 'Capacity Range',
            items: [
              'Small domestic units: 5-20 LPH',
              'Commercial units: 50-500 LPH',
              'Industrial units: 1000+ LPH',
            ],
          },
          {
            title: 'Standard Features',
            items: [
              'Advanced multi-stage filtration',
              'High-performance RO membranes',
              'Automatic shutoff valves',
              'Storage tank options',
              'Pressure gauges and indicators',
              'Automatic cleaning systems available',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'stp-etp-pva-gel',
    title: 'STP / ETP / PVA Gel',
    shortTitle: 'STP / ETP',
    category: 'Wastewater',
    image: '/images/stp-etp-plant-DKM8anl_.jpg',
    summary: 'Efficient STP, ETP, and PVA Gel solutions for wastewater treatment',
    details:
      'Wastewater treatment solutions for contaminants, biological treatment, reuse readiness, and safe discharge.',
    link: '#product-explainer',
    benefits: [
      'Preliminary, primary, secondary, and tertiary treatment planning',
      'Biological Oxygen Demand (BOD) reduction',
      'Chemical Oxygen Demand (COD) reduction',
      'Maintaining pH balance',
      'Minimum or zero discharge focus',
      'Recycling of wastewater',
    ],
    useCases: [
      'Residential sewage treatment',
      'Commercial sewage treatment',
      'Industrial effluent treatment',
      'Wastewater reuse',
      'Compact STP plant requirements',
      'PVA Gel biological treatment enhancement',
    ],
    detailSections: [
      {
        title: 'Effluent Treatment Plant',
        body: [
          'Effluent Treatment Plants or ETPs are used to remove any toxic substances from water and make water pure. Marcos Water Solution is the manufacturer of ETP Plant in Civil and Mechanical both in Noida, Delhi NCR, India and other countries also. Industrial wastewater (effluent) is treated in a number of ways; the level of treatment decides which is appropriate. Basically there are four steps: Preliminary, Primary, Secondary and Tertiary.',
        ],
        groups: [
          {
            title: 'Treatment Stages',
            items: [
              'Preliminary Treatment: Screening, grit and oil removal are done at preliminary treatment process.',
              'Primary Treatment: Primary treatment involves removal of suspended solids up to 50% and reducing BOD level up to 30%.',
              'Secondary Treatment: Biological processes convert dissolved and suspended organic matter into settleable suspended solids.',
              'Tertiary Treatment: Final advanced treatment improves treated wastewater quality before reuse or discharge.',
            ],
          },
        ],
      },
      {
        title: 'Sewage Treatment Plant (STP)',
        body: [
          'Sewage treatment or STP plant is used to remove contaminants from waste water. It involves physical, chemical and biological process to remove physical, chemical and biological contaminants.',
          'STP Plant is very effective and economical. Marcos Water Solution is the manufacturer of STP plant in civil and mechanical both based in Noida, Delhi NCR, India.',
          'Our clients give positive feedback for the compact design, user friendly, durability, low maintenance, corrosion resistance and longer service life features of all our STP plant structures and performance.',
        ],
        groups: [
          {
            title: 'Key Specifications',
            items: [
              'Manufacture of capacity 1 kld, 2 kld to 500 kld',
              'Fully automatic and semi-automatic STP plants',
              'We also provide STP operator',
            ],
          },
          {
            title: 'Salient Features of Compact STP Plant',
            items: [
              'Biological Oxygen Demand (BOD) reduction',
              'Carbon Oxygen Demand (COD) reduction',
              'Maintaining PH balance',
              'On site assistance by qualified engineers',
              'Minimum or Zero discharge',
              'Colorless & odor less treated water',
              'Highly suitable for inconsistent sewage',
              'Recycling of waste water',
            ],
          },
          {
            title: 'Benefits of Compact STP Plant',
            items: [
              'Based on Green Technology Concept',
              'Minimum Discharge',
              'Low power consumption',
              'Sludge removal once in two years',
              'Pre-Engineered & Pre-Fabricated Plant',
              'No odour problem',
            ],
          },
        ],
      },
      {
        title: 'PVA Gel Technology',
        body: [
          "PVA gel from Kuraray Company is a biocarrier used to enhance wastewater treatment and thus protect our Earth's environment.",
          'Through over a decade of research and development, Kuraray Company has established PVA-gel beads as an effective biological wastewater treatment technology.',
          'PVA (polyvinyl alcohol) gel is a porous hydrogel that is ideally suited for Immobilization of microorganisms essential for the degradation of environmental pollutants.',
        ],
        groups: [
          {
            title: 'Key Characteristics of PVA Gel',
            items: [
              'Formed as 4 mm spherical beads having a specific gravity of 1025 +/- 0.01 with excellent fluidity in water requiring minimal energy for mixing',
              'Treatment yields less excess sludge as compared to conventional biological methods',
              'Very high water content due to its extensive porosity, allowing for favourable permeability of oxygen and nutrients to the bacteria colonized inside the beads',
              'Polymerized PVA gel is essentially insoluble in water and is not known to be biodegradable',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'water-softener',
    title: 'Water Softener',
    shortTitle: 'Water Softener',
    category: 'Domestic / Commercial',
    image: '/images/water-softner-CTOMiZvD.jpg',
    summary: 'Hard water treatment and softening systems',
    details:
      'Water softening systems that remove calcium and magnesium using resin beads and regeneration.',
    link: '#product-explainer',
    benefits: [
      'Counter current regeneration with up flow rate',
      'Co-current regeneration with down flow rate',
      'Longer operating cycles',
      'Low regeneration cost',
      'Efficient ion exchange technology',
    ],
    useCases: [
      'Domestic water softening plants',
      'Commercial water softening plants',
      'Customized solutions as per customer requirements',
      'Water softening systems designed for daily use concerns',
    ],
    detailSections: [
      {
        title: 'Water Softener',
        body: [
          'Water Softener removes Calcium and Magnesium in hard water by using Resin Beads and cleans itself periodically by an important process called Regeneration. It also removes certain metal cations in hard water, which converts hard water into soft water and reduces the salt concentration in the water. Soft water reduces the maintenance cost of expensive fittings and bathing systems.',
        ],
      },
      {
        title: 'KS Technology Water Softeners',
        body: [
          'KS Technology softener is used primarily to produce soft water by highly acidic content of exchanger. The KS Technology series of water softener is designed for counter current regeneration with up flow rate and co-current regeneration with down flow rate. KS Technology softeners are designed for longer operating cycles with low regeneration cost.',
        ],
        groups: [
          {
            title: 'Available Options',
            items: [
              'Domestic water softening plants',
              'Commercial water softening plants',
              'Customized solutions as per customer requirements',
              'Water softening systems designed for daily use concerns',
            ],
          },
          {
            title: 'Hard Water Disadvantages',
            items: [
              'Hair fall and hair damage',
              'Skin problems and irritation',
              'Expensive maintenance of bath fittings and geysers',
              'Allergies and skin allergies',
              'Reduces lifespan of appliances',
              'Increases energy consumption',
              'Scale buildup in pipes and heating systems',
              'Reduces effectiveness of soaps and detergents',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'spare-parts',
    title: 'Spare Parts',
    shortTitle: 'Spare Parts',
    category: 'Support',
    image: '/images/spare-part-BXtYTz4K.jpg',
    summary: 'Quality replacement parts and accessories',
    details:
      'Spare parts for water treatment systems, wastewater treatment systems, and hard water treatment systems.',
    link: '#product-explainer',
    benefits: [
      'Fast and reliable delivery',
      'Technical support and consultation',
      'Bulk order discounts',
      'Customized solutions as per requirements',
      'Installation guidance and support',
      'After-sales service and maintenance',
    ],
    useCases: [
      'Residential water treatment systems',
      'Commercial water purification plants',
      'Industrial wastewater treatment',
      'Hotels and restaurants',
      'Hospitals and healthcare facilities',
      'Manufacturing and processing plants',
    ],
    detailSections: [
      {
        title: 'Spare Parts',
        body: [
          'We are the Manufacturer of all spare parts Related to water Treatment System, Waste Water Treatment system and hard water Treatment.',
        ],
      },
      {
        title: 'Comprehensive Spare Parts Range',
        groups: [
          {
            title: 'Available Spare Parts Categories',
            items: [
              'RO Membrane and Cartridges',
              'Resin Beads for Water Softeners',
              'Filters and Filter Housings',
              'Valves and Control Systems',
              'Pumps and Motors',
              'Tanks and Vessels',
              'Pipes, Fittings and Connectors',
              'Pressure Gauges and Indicators',
              'UV Lamps and Bulbs',
              'Dosing Equipment',
            ],
          },
          {
            title: 'Quality Assurance',
            items: [
              '100% Original and Authentic parts',
              'ISO certified manufacturing process',
              'Rigorous quality testing before delivery',
              'Warranty on all spare parts',
            ],
          },
          {
            title: 'Product Range',
            items: [
              'Compatible with all major brands',
              'For RO, UF, STP, ETP systems',
              'For water softeners and filters',
              'For industrial and domestic applications',
            ],
          },
        ],
      },
      {
        title: 'Ordering & Support',
        body: [
          'We maintain a comprehensive inventory of spare parts to ensure quick availability and delivery. Whether you need a single component or bulk orders for your treatment plant, we have you covered.',
          'Our technical team is available to assist you in selecting the right spare parts for your specific water treatment system. We also provide installation guidance and after-sales support to ensure optimal performance of your equipment.',
        ],
      },
    ],
  },
  {
    slug: 'industrial-ro',
    title: 'Industrial RO',
    shortTitle: 'Industrial RO',
    category: 'Industrial',
    image: '/images/industry.png',
    summary: 'Large capacity industrial RO systems',
    details:
      'Large-capacity RO systems for manufacturing, facility, and process water needs.',
    link: '#product-explainer',
    benefits: [
      'Large capacity planning',
      'Advanced multi-stage filtration',
      'High-performance RO membranes',
      'Pressure gauges and indicators',
      'Automatic cleaning systems available',
      'Maintenance and spare parts support',
    ],
    useCases: [
      'Manufacturing plants',
      'Process water support',
      'Food and beverage processing',
      'Healthcare facilities',
      'Hospitality sectors',
    ],
    detailSections: [
      {
        title: 'Industrial RO Systems',
        body: [
          'Industrial RO systems are built for facilities that require reliable purified water at larger capacities. Marcos Water Solutions combines system selection, installation guidance, and ongoing service support for industrial and commercial use.',
        ],
      },
    ],
  },
]

// Editable generic workflow used for the interactive explainer when product-specific
// engineering drawings are not available in the source website.
export const explainerSteps = [
  {
    title: 'Requirement & Water Intake',
    label: 'Intake',
    description:
      'The project starts with the water source, capacity need, usage pattern, and site conditions.',
    detail:
      'Raw water or wastewater enters the selected system after consultation and requirement understanding.',
  },
  {
    title: 'Pre-Filtration / Primary Treatment',
    label: 'Pre-filter',
    description:
      'Sediment, grit, oil, and larger physical contaminants are reduced before the main treatment stage.',
    detail:
      'This protects downstream membranes, media, biological processes, and treatment equipment.',
  },
  {
    title: 'Core Treatment',
    label: 'Treatment',
    description:
      'RO membranes, ion exchange softening, biological treatment, or ETP/STP processing handles the main purification work.',
    detail:
      'The core stage changes based on whether the need is drinking water, soft water, sewage treatment, or effluent treatment.',
  },
  {
    title: 'Output, Reuse, or Discharge',
    label: 'Output',
    description:
      'Treated water is stored, supplied, reused, or prepared for safe discharge depending on the system.',
    detail:
      'The output goal can be low TDS water, softened water, recycled water, or treated wastewater.',
  },
  {
    title: 'Maintenance & Spare Parts',
    label: 'Support',
    description:
      'Maintenance, operator support, and spare part availability keep the system performing over time.',
    detail:
      'Marcos supports components such as membranes, valves, filters, pumps, tanks, gauges, UV lamps, and dosing equipment.',
  },
]
