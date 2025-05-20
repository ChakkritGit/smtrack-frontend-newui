import { Vibrant } from 'node-vibrant/browser'
import { Dispatch, SetStateAction } from 'react'

const getOKLCHColor = (themeMode: string, system: string): string => {
  switch (themeMode) {
    case 'light':
      return 'oklch(1 0 0 / 0.8)'
    case 'dark':
      return 'oklch(25.33% 0.016 252.42 / 0.8)'
    case 'cupcake':
      return 'oklch(97.788% 0.004 56.375 / 0.8)'
    case 'bumblebee':
      return 'oklch(1 0 0 / 0.8)'
    case 'emerald':
      return 'oklch(1 0 0 / 0.8)'
    case 'corporate':
      return 'oklch(1 0 0 / 0.8)'
    case 'synthwave':
      return 'oklch(15% 0.09 281.288 / 0.8)'
    case 'retro':
      return 'oklch(91.637% 0.034 90.515 / 0.8)'
    case 'cyberpunk':
      return 'oklch(94.51% 0.179 104.32 / 0.8)'
    case 'valentine':
      return 'oklch(97% 0.014 343.198 / 0.8)'
    case 'halloween':
      return 'oklch(21% 0.006 56.043 / 0.8)'
    case 'garden':
      return 'oklch(92.951% 0.002 17.197 / 0.8)'
    case 'forest':
      return 'oklch(20.84% 0.008 17.911 / 0.8)'
    case 'aqua':
      return 'oklch(37% 0.146 265.522 / 0.8)'
    case 'lofi':
      return 'oklch(1 0 0 / 0.8)'
    case 'pastel':
      return 'oklch(1 0 0 / 0.8)'
    case 'fantasy':
      return 'oklch(1 0 0 / 0.8)'
    case 'wireframe':
      return 'oklch(1 0 0 / 0.8)'
    case 'black':
      return 'oklch(0 0 0 / 0.8)'
    case 'luxury':
      return 'oklch(14.076% 0.004 285.822 / 0.8)'
    case 'dracula':
      return 'oklch(28.822% 0.022 277.508 / 0.8)'
    case 'cmyk':
      return 'oklch(1 0 0 / 0.8)'
    case 'autumn':
      return 'oklch(95.814% 0 0 / 0.8)'
    case 'business':
      return 'oklch(24.353% 0 0 / 0.8)'
    case 'acid':
      return 'oklch(98% 0 0 / 0.8)'
    case 'lemonade':
      return 'oklch(98.71% 0.02 123.72 / 0.8)'
    case 'night':
      return 'oklch(20.768% 0.039 265.754 / 0.8)'
    case 'coffee':
      return 'oklch(24% 0.023 329.708 / 0.8)'
    case 'winter':
      return 'oklch(1 0 0 / 0.8)'
    case 'dim':
      return 'oklch(30.857% 0.023 264.149 / 0.8)'
    case 'nord':
      return 'oklch(95.127% 0.007 260.731 / 0.8)'
    case 'sunset':
      return 'oklch(22% 0.019 237.69 / 0.8)'
    case 'caramellatte':
      return 'oklch(98% 0.016 73.684 / 0.8)'
    case 'abyss':
      return 'oklch(20% 0.08 209 / 0.8)'
    case 'silk':
      return 'oklch(97% 0.0035 67.78 / 0.8)'
    case 'halfview':
      return 'oklch(14% 0.005 285.823 / 0.8)'
    case 'dinosaur':
      return 'oklch(98% 0 0 /0.8)'
    case 'slaybanana':
      return 'oklch(98% 0.014 180.72 /0.8)'
    case 'capocean':
      return 'oklch(97% 0.014 254.604 /0.8)'
    case 'blessedwizard':
      return 'oklch(27% 0.046 192.524 /0.8)'
    case 'sigmataco':
      return 'oklch(98% 0.001 106.423 /0.8)'
    case 'unboss':
      return 'oklch(27% 0.077 45.635 /0.8)'
    case 'averageghost':
      return 'oklch(98% 0.018 155.826 /0.8)'
    case 'daisyspace':
      return 'oklch(98% 0 0 /0.8)'
    case 'glasssupreme':
      return 'oklch(27% 0.072 132.109 /0.8)'
    case 'neonfade':
      return 'oklch(98% 0.003 247.858 /0.8)'
    case 'toxicmoon':
      return 'oklch(98% 0.001 106.423 /0.8)'
    case 'junglewoodnight':
      return 'oklch(14% 0.004 49.25 /0.8)'
    case 'junglewoodday':
      return 'oklch(98% 0.001 106.423 /0.8)'
    case 'extremelight':
      return 'oklch(98% 0.001 106.423 /0.8)'
    case 'extremedark':
      return 'oklch(14% 0.004 49.25 /0.8)'
    case 'redvelvetlight':
      return 'oklch(98% 0.002 247.839 /0.8)'
    case 'redvelvetdark':
      return 'oklch(26% 0.007 34.298 /0.8)'
    case 'oceanshallow':
      return 'oklch(92% 0.003 48.717 /0.8)'
    case 'oceandeep':
      return 'oklch(26% 0.007 34.298 /0.8)'
    case 'sigmaandmore':
      return 'oklch(98% 0.001 106.423 /0.8)'
    case 'coolbro':
      return 'oklch(98% 0 0 /0.8)'
    case 'coolsquad':
      return 'oklch(13% 0.028 261.692 /0.8)'
    case 'tinyocean':
      return 'oklch(45% 0.085 224.283 /0.8)'
    case 'windowsxp':
      return 'oklch(0.50 0.2035 263.15 /0.8)'
    case 'hugepenguin':
      return 'oklch(98% 0.001 106.423 /0.8)'
    case 'tinystar':
      return 'oklch(96% 0.018 272.314 /0.8)'
    case 'darkcaramellatte':
      return 'oklch(27% 0.006 286.033 /0.8)'
    case 'hotspace':
      return 'oklch(98% 0.001 106.423 /0.8)'
    case 'goblinjuggly':
      return 'oklch(98% 0.001 106.423 /0.8)'
    default:
      return system === 'dark'
        ? 'oklch(25.33% 0.016 252.42 / 0.8)'
        : 'oklch(1 0 0 / 0.8)'
  }
}

const getColor = async (
  image: string,
  index: number,
  setColors: Dispatch<SetStateAction<string[]>>
) => {
  try {
    const palette = await Vibrant.from(image).getPalette()
    setColors(prevColors => {
      const updatedColors = [...prevColors]
      updatedColors[index] = palette.Vibrant?.hex || ''
      return updatedColors
    })
  } catch (error) {
    console.error('Error fetching color:', error)
  }
}

export { getOKLCHColor, getColor }
