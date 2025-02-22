import { TopicsTable } from '../components/TopicsTable'
import { Topic } from '../utils/db'
import { createClient } from '../utils/supabase/server'
import Image from "next/image"

export const revalidate = 0

export default async function TopicsPage() {
  const supabase = await createClient()
  const { data: topics } = await supabase
    .from('topics')
    .select('*')
    .order('name') as { data: Topic[] }

  return (
    <div className="mx-auto pt-6">
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
          <div className="relative flex justify-center">
            <Image
              src="https://res.cloudinary.com/ducqjmtlk/image/upload/v1738267414/demodemo_1_hc3xrz.png"
              alt="Demo Visualization"
              width={1600}  // increased width further
              height={1200} // increased height further
              quality={100}
              className="object-contain"
              priority
              style={{ marginTop: '0px' }}
            />
          </div>
        </div>
      </section>
      <TopicsTable topics={topics || []} />
    </div>
  )
}
