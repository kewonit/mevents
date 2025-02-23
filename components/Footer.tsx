import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-black text-white py-8 sm:py-12 w-full">
      <div className="container mx-auto px-4 w-full">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start w-full">
          <div className="flex flex-col items-center lg:items-start gap-4 sm:gap-2 w-full">
            <div className="w-[360px] h-[120px] relative mb-4 sm:mb-2">
              <Image
                src="https://res.cloudinary.com/dfyrk32ua/image/upload/v1740208532/kommodex/kommodex_ke2bom.webp"
                alt="kommodex logo"
                fill
                sizes="360px"
                className="object-contain object-left"
                priority
                quality={100}
                draggable={false}
                style={{ filter: "invert(1)" }}
              />
            </div>
            <div className="flex flex-wrap justify-center gap-4 lg:gap-12 text-sm">
              <Link href="/changelog" className="hover:opacity-80 font-instrument-sans">
                Changelog
              </Link>
              <Link href="/contact" className="hover:opacity-80 font-instrument-sans">
                Contact
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 lg:mt-40 text-sm opacity-70 text-center lg:text-left">
          <div>
            Built using exclusively open-source technologies and developed with exemplary efficiency under 36 hours at localhost:pune @ FOSSHack &apos;25
          </div>
          <div>
            Distributed under <a href="https://opensource.org/licenses/MIT" className="hover:underline">the MIT License</a> | <a href="https://github.com/kewonit/mevents/" className="hover:underline">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
