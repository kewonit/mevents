import { TopicsTable } from '../components/TopicsTable'
import { TopicWithStats as Topic } from '../utils/db'
import Image from "next/image"

export const revalidate = 0

export default async function TopicsPage() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/topics/stats`)
  const topics = await response.json() as Topic[]

  return (
    <div className="mx-auto pt-6 overflow-x-hidden">
      <section className="w-full bg-gradient-to-r from-[#f3f1ea] to-[#e0d8c3] relative">
        <div className="w-full h-[50px]">
          <div
            className="w-full h-full"
            style={{
              background: "linear-gradient(0deg, rgba(243, 241, 234, 0.00) 0%, #DCD5C1 100%)",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </div>  
        <div className="container mx-auto px-4 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-0">
          <div className="lg:ml-8">
            <p className="font-instrument-serif text-gray-900 text-[48px] leading-tight max-w-md">
              Topics you <br />
              will enjoy surfing 🌊
            </p>
            <p className="font-instrument-sans text-gray-800 max-w-sm mt-6">
              Explore the topics that interest you the most and find communities that share your interests. Find your tribe and start surfing the waves of knowledge together.
            </p>
          </div>
          <div className="relative overflow-visible">
            <Image
              src="https://res.cloudinary.com/dfyrk32ua/image/upload/v1740224775/kommodex/MacBook_Air_-_2_txgi16.webp"
              alt="Demo Visualization"
              width={3000}
              height={2400}
              quality={100}
              className="object-contain scale-125"
              priority
              style={{ 
                marginTop: '0px',
                transform: 'scale(1.5)'
              }}
            />
          </div>
        </div>
      </section>
      <TopicsTable topics={topics || []} />
    </div>
  )
}
