export type BookingProduct = {
  id: string
  name: string
  category: string
  description: string
  useCase: string
  features: string[]
  bookingEnabled: boolean
  image: string
  detailSlug?: string
}

export const products: BookingProduct[] = [
  {
    id: 'industrial-ro',
    name: 'Industrial RO',
    category: 'Water Treatment',
    description: 'Premium system design, installation, and support.',
    useCase: 'Industrial and commercial water purification',
    features: [
      'High-efficiency filtration',
      'Industrial-grade setup',
      'Custom capacity planning',
      'Installation and support',
    ],
    bookingEnabled: true,
    image: '/images/industry.png',
    detailSlug: 'industrial-ro',
  },
  {
    id: 'stp-etp',
    name: 'STP / ETP',
    category: 'Wastewater Treatment',
    description: 'Premium system design, installation, and support.',
    useCase: 'Sewage and effluent treatment for commercial and industrial spaces',
    features: [
      'Wastewater treatment planning',
      'Commercial and industrial use',
      'Setup and commissioning',
      'Maintenance support',
    ],
    bookingEnabled: true,
    image: '/images/stp-etp-plant-DKM8anl_.jpg',
    detailSlug: 'stp-etp-pva-gel',
  },
  {
    id: 'water-softeners',
    name: 'Water Softeners',
    category: 'Water Conditioning',
    description: 'Premium system design, installation, and support.',
    useCase: 'Hard water treatment for homes, offices, hotels, and industries',
    features: [
      'Hardness reduction',
      'Pipeline and appliance protection',
      'Domestic and commercial use',
      'Support and maintenance',
    ],
    bookingEnabled: true,
    image: '/images/water-softener.png',
    detailSlug: 'water-softener',
  },
  {
    id: 'ro-plant-system',
    name: 'RO Plant System',
    category: 'Enterprise Water Filtration',
    description: 'Industrial and commercial RO plant system for clean water operations.',
    useCase: 'Enterprise water filtration',
    features: [
      'Industrial and commercial capacity',
      'Reliable filtration process',
      'System design support',
      'Quality-focused setup',
    ],
    bookingEnabled: true,
    image: '/images/ro-plant-product.png',
    detailSlug: 'ro-plant',
  },
  {
    id: 'spare-parts',
    name: 'Spare Parts',
    category: 'Support',
    description: 'Reliable spare parts support for water treatment systems.',
    useCase: 'Replacement and maintenance support',
    features: [
      'System parts support',
      'Maintenance-ready components',
      'Service assistance',
      'Business-friendly support',
    ],
    bookingEnabled: true,
    image: '/images/spare.png',
    detailSlug: 'spare-parts',
  },
  {
    id: 'installation-support',
    name: 'Installation Support',
    category: 'Service',
    description: 'Professional installation support for water treatment systems.',
    useCase: 'New system setup and commissioning',
    features: [
      'Site understanding',
      'Setup support',
      'Installation planning',
      'Post-installation guidance',
    ],
    bookingEnabled: true,
    image: '/images/installation-support.png',
  },
  {
    id: 'maintenance-support',
    name: 'Maintenance Support',
    category: 'Service',
    description: 'Maintenance support for reliable system performance.',
    useCase: 'Ongoing support and system care',
    features: [
      'Routine maintenance',
      'Performance checks',
      'Issue support',
      'System care guidance',
    ],
    bookingEnabled: true,
    image: '/images/packed-stp-plant-W2aTmhTX.jpeg',
  },
]

export function getBookingProductById(id: string) {
  return products.find((product) => product.id === id)
}
