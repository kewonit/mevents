import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-black text-white py-8 sm:py-12 w-full">
      <div className="container mx-auto px-4 w-full">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start w-full">
          <div className="flex flex-col items-center lg:items-start gap-4 sm:gap-2 w-full">
            <div className="w-[46px] h-[13px] relative mb-4 sm:mb-2">
              <Image
                src="https://res.cloudinary.com/ducqjmtlk/image/upload/q_100/v1737901490/nuablack_dgaajp.png"
                alt="Nua Logo"
                fill
                sizes="46px"
                className="object-contain object-left"
                quality={100}
              />
            </div>
            <div className="flex flex-wrap justify-center gap-4 lg:gap-12 text-sm">
              <Link href="/changelog" className="hover:opacity-80 font-instrument-sans">
                Changelog
              </Link>
              <Link href="/blog" className="hover:opacity-80 font-instrument-sans">
                Blog
              </Link>
              <Link href="/about-us" className="hover:opacity-80 font-instrument-sans">
                About us
              </Link>
              <Link href="/contact" className="hover:opacity-80 font-instrument-sans">
                Contact
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 lg:mt-40 text-sm opacity-70 text-center lg:text-left font-instrument-serif">
          Open Sourced under the MIT License | <a href="https://github.com/kewonit/mevents/">Github</a>
        </div>
      </div>
    </footer>
  )
}
