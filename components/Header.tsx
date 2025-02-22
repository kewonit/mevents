import Image from "next/image"
import Link from "next/link"

export function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 
      bg-[#F2F1EA]/80 backdrop-blur-lg border-b-2 border-[#E8E8E8]
      h-[66px] flex items-center"
    >
      <div className="container mx-auto px-4 flex justify-between items-center w-full max-w-7xl">
        <div className="lg:absolute lg:left-[271px]">
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
        </div>

        <div className="lg:absolute lg:right-[271px] flex items-center gap-4 sm:gap-[40px]">
          <Link
            href="/changelog"
            className="text-[13px] font-medium text-gray-700 hover:text-gray-900 transition-colors font-instrument-sans"
          >
            Changelog
          </Link>
          <Link
            href="/login"
            className="text-[13px] font-medium bg-black text-white px-[13px] pt-[8px] pb-[8px] rounded-[7px] hover:bg-gray-800 transition-colors font-instrument-sans whitespace-nowrap"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  )
}
