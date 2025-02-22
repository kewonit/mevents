import { Instrument_Sans } from 'next/font/google'
import localFont from 'next/font/local'

export const instrumentSerif = localFont({
  src: [
    {
      path: '../public/fonts/InstrumentSerif-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-instrument-serif',
})

export const instrumentSerifItalic = localFont({
  src: [
    {
      path: '../public/fonts/InstrumentSerif-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-instrument-serif-italic',
})

export const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-instrument-sans',
  display: 'swap',
})

