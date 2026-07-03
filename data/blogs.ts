export type BlogContentBlock = {
  heading: string
  paragraph: string
}

export type Blog = {
  id: number
  title: string
  slug: string
  metaTitle: string
  metaDescription: string
  excerpt: string
  category: string
  keywords: string[]
  author: string
  date: string
  readTime: string
  image: string
  content: BlogContentBlock[]
}

export const blogs: Blog[] = [
  {
    id: 1,
    title: 'How Industrial RO Plants Help Businesses Get Clean Water',
    slug: 'industrial-ro-plants-clean-water-businesses',
    metaTitle: 'Industrial RO Plants for Businesses | Marcos Water Solutions',
    metaDescription:
      'Learn how industrial RO plants help businesses get clean, safe, and reliable water for commercial and industrial operations.',
    excerpt:
      'Learn how industrial RO systems remove impurities and support safe, reliable water usage for commercial and industrial needs.',
    category: 'Industrial RO',
    keywords: [
      'industrial RO plant',
      'commercial RO system',
      'water treatment solution',
      'RO plant for business',
    ],
    author: 'Marcos Water Solutions',
    date: '2026-01-01',
    readTime: '4 min read',
    image: '/images/blog-industrial-ro.jpg',
    content: [
      {
        heading: 'What is an Industrial RO Plant?',
        paragraph:
          'An industrial RO plant is a water treatment system designed to remove dissolved salts, impurities, and contaminants from water using reverse osmosis technology.',
      },
      {
        heading: 'Why Businesses Need RO Systems',
        paragraph:
          'Businesses need consistent water quality for production, cleaning, processing, and safe daily operations.',
      },
      {
        heading: 'Maintenance and Support',
        paragraph:
          'Regular maintenance improves system life, water quality, and operational efficiency.',
      },
    ],
  },
  {
    id: 2,
    title: 'STP and ETP Systems Explained for Commercial Properties',
    slug: 'stp-etp-systems-commercial-properties',
    metaTitle: 'STP and ETP Systems for Commercial Properties',
    metaDescription:
      'Understand the difference between STP and ETP systems and how they help commercial and industrial properties manage wastewater.',
    excerpt:
      'Understand the difference between STP and ETP systems and how they help businesses manage wastewater responsibly.',
    category: 'STP / ETP',
    keywords: ['STP plant', 'ETP plant', 'wastewater treatment', 'commercial sewage treatment'],
    author: 'Marcos Water Solutions',
    date: '2026-01-02',
    readTime: '5 min read',
    image: '/images/blog-stp-etp.jpg',
    content: [
      {
        heading: 'What is STP?',
        paragraph:
          'A sewage treatment plant treats domestic wastewater from buildings, industries, hotels, and commercial spaces.',
      },
      {
        heading: 'What is ETP?',
        paragraph:
          'An effluent treatment plant treats industrial wastewater before safe disposal or reuse.',
      },
      {
        heading: 'Why Proper Wastewater Treatment Matters',
        paragraph:
          'Proper wastewater treatment helps protect the environment, reduce waste, and support cleaner operations.',
      },
    ],
  },
  {
    id: 3,
    title: 'Why Water Softeners Are Important for Homes and Businesses',
    slug: 'why-water-softeners-important',
    metaTitle: 'Why Water Softeners Are Important | Marcos Water Solutions',
    metaDescription:
      'Learn how water softeners reduce hard water problems and protect appliances, pipelines, and water systems.',
    excerpt:
      'Hard water can damage appliances, pipelines, and water systems. Learn how water softeners solve this problem.',
    category: 'Water Softeners',
    keywords: ['water softener', 'hard water treatment', 'commercial water softener', 'home water softener'],
    author: 'Marcos Water Solutions',
    date: '2026-01-03',
    readTime: '3 min read',
    image: '/images/blog-water-softener.jpg',
    content: [
      {
        heading: 'What is Hard Water?',
        paragraph:
          'Hard water contains high levels of minerals such as calcium and magnesium, which can cause scaling and reduce system efficiency.',
      },
      {
        heading: 'How Water Softeners Help',
        paragraph:
          'Water softeners reduce hardness and protect pipelines, equipment, and appliances.',
      },
      {
        heading: 'Who Needs a Water Softener?',
        paragraph:
          'Homes, hotels, factories, offices, and commercial buildings can benefit from water softening solutions.',
      },
    ],
  },
]

export const blogCategories = ['All', ...Array.from(new Set(blogs.map((blog) => blog.category)))]

export function getBlogBySlug(slug: string) {
  return blogs.find((blog) => blog.slug === slug)
}

export function getRelatedBlogs(blog: Blog, limit = 3) {
  return blogs.filter((item) => item.category === blog.category && item.slug !== blog.slug).slice(0, limit)
}
