import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import LakeDetails from '@/app/components/LakeDetails'
import clientPromise from '@/app/lib/mongodb'

// Define the Lake interface
interface Lake {
  id: string
  name: string
  description: string
  imageUrl: string
  location: {
    latitude: number
    longitude: number
  }
  statistics: {
    area: number
    maxDepth: number
    averageDepth: number // Added averageDepth property
  }
  waterQuality: string
  activities: string[]
}

// Define the props for the page component
interface PageProps {
  params: { lakeName: string }
}

// Generate metadata for the page
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const lake = await getLakeData(params.lakeName)
  
  if (!lake) {
    return {
      title: 'Lake Not Found',
    }
  }

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: `${lake.name} - Clean Lakes`,
    description: `Discover ${lake.name}, its water quality, activities, and more. Explore one of America's beautiful lakes.`,
    openGraph: {
      title: `${lake.name} - Clean Lakes`,
      description: `Discover ${lake.name}, its water quality, activities, and more. Explore one of America's beautiful lakes.`,
      images: [lake.imageUrl, ...previousImages],
    },
    twitter: {
      card: 'summary_large_image',
    },
    alternates: {
      canonical: `https://cleanlakes.ai/lakes/${lake.name.toLowerCase().replace(/ /g, '-')}`,
    },
  }
}

// Generate static params for all lakes
export async function generateStaticParams() {
  const client = await clientPromise
  const db = client.db("cleanlakes")
  const lakes = await db.collection("lakes").find({}, { projection: { name: 1 } }).toArray()

  return lakes.map((lake) => ({
    lakeName: lake.name.toLowerCase().replace(/ /g, '-'),
  }))
}

// Fetch lake data
async function getLakeData(lakeName: string): Promise<Lake | null> {
  const client = await clientPromise
  const db = client.db("cleanlakes")
  const lake = await db.collection("lakes").findOne({ 
    name: { $regex: new RegExp(lakeName.replace(/-/g, ' '), 'i') } 
  })

  if (lake) {
    return {
      id: lake._id.toString(),
      name: lake.name,
      description: lake.description,
      imageUrl: lake.imageUrl,
      location: lake.location,
      statistics: {
        area: lake.statistics.area,
        maxDepth: lake.statistics.maxDepth,
        averageDepth: lake.statistics.averageDepth || 0, // Provide a default value if not present
      },
      waterQuality: lake.waterQuality || 'Unknown',
      activities: lake.activities || [],
    } as Lake
  }

  return null
}

// Page component
export default async function LakePage({ params }: PageProps) {
  const lake = await getLakeData(params.lakeName)

  if (!lake) {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LakeBodyOfWater",
    "name": lake.name,
    "description": lake.description,
    "image": lake.imageUrl,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": lake.location.latitude,
      "longitude": lake.location.longitude
    },
    "areaTotal": {
      "@type": "QuantitativeValue",
      "value": lake.statistics.area,
      "unitCode": "KMK"
    },
    "maximumDepth": {
      "@type": "QuantitativeValue",
      "value": lake.statistics.maxDepth,
      "unitCode": "MTR"
    },
    "averageDepth": {
      "@type": "QuantitativeValue",
      "value": lake.statistics.averageDepth,
      "unitCode": "MTR"
    },
    "waterQuality": lake.waterQuality,
    "amenityFeature": lake.activities.map(activity => ({
      "@type": "LocationFeatureSpecification",
      "name": activity
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LakeDetails lake={lake} />
    </>
  )
}

// Enable on-demand revalidation
export const revalidate = 3600 // Revalidate every hour