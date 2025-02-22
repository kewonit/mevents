import Image from "next/image"
import Link from "next/link"
import { getAuthSession } from "@/lib/auth"

export async function Header() {
  const user = await getAuthSession()
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F2F1EA]/80 backdrop-blur-lg border-b-2 border-[#E8E8E8] h-[66px] flex items-center">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center w-full">
        <div className="w-[120px] h-[32px] relative">
          <Link href="/">
            <Image
              src="https://res.cloudinary.com/dfyrk32ua/image/upload/v1740208532/kommodex/kommodex_ke2bom.webp"
              alt="Nua Logo"
              fill
              sizes="120px"
              className="object-contain object-left"
              priority
              quality={100}
            />
          </Link>
        </div>

        <div className="flex items-center gap-4 sm:gap-[40px]">
          <Link
            href="/changelog"
            className="text-[13px] font-medium text-gray-700 hover:text-gray-900 transition-colors font-instrument-sans"
          >
            Changelog
          </Link>
          <Link
            href={user ? "/dashboard" : "/login"}
            className="text-[13px] font-medium bg-black text-white px-[13px] pt-[8px] pb-[8px] rounded-[7px] hover:bg-gray-800 transition-colors font-instrument-sans whitespace-nowrap"
          >
            {user ? "Dashboard" : "Login"}
          </Link>
        </div>
      </div>
    </header>
  )
}
