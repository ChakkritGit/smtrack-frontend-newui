import { Vibrant } from "node-vibrant/browser"
import { Dispatch, SetStateAction } from "react"

const getOKLCHColor = (themeMode: string, system: string): string => {
  switch (themeMode) {
    case 'light':
      return 'oklch(1 0 0 / 0.8)'
    case 'dark':
      return 'oklch(25.3267% 0.015896 252.417568 / 0.8)'
    case 'cupcake':
      return 'oklch(97.7882% 0.00418 56.375637 / 0.8)'
    case 'bumblebee':
      return 'oklch(1 0 0 / 0.8)'
    case 'emerald':
      return 'oklch(1 0 0 / 0.8)'
    case 'corporate':
      return 'oklch(1 0 0 / 0.8)'
    case 'synthwave':
      return 'oklch(21.8216% 0.081948 287.835609 / 0.8)'
    case 'retro':
      return 'oklch(91.6374% 0.034554 90.51575 / 0.8)'
    case 'cyberpunk':
      return 'oklch(94.51% 0.179 104.32 / 0.8)'
    case 'valentine':
      return 'oklch(94.6846% 0.026703 337.06289 / 0.8)'
    case 'halloween':
      return 'oklch(24.7759% 0 0 / 0.8)'
    case 'garden':
      return 'oklch(92.9519% 0.002163 17.197414 / 0.8)'
    case 'forest':
      return 'oklch(18.8409% 0.00829 17.911578 / 0.8)'
    case 'aqua':
      return 'oklch(48.7596% 0.127539 261.181672 / 0.8)'
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
      return 'oklch(0.14 0 0 / 0.8)'
    case 'dracula':
      return 'oklch(28.8229% 0.022103 277.508664 / 0.8)'
    case 'cmyk':
      return 'oklch(1 0 0 / 0.8)'
    case 'autumn':
      return 'oklch(95.8147% 0 0 / 0.8)'
    case 'business':
      return 'oklch(24.3535% 0 0 / 0.8)'
    case 'acid':
      return 'oklch(98.5104% 0 0 / 0.8)'
    case 'lemonade':
      return 'oklch(98.71% 0.02 123.72 / 0.8)'
    case 'night':
      return 'oklch(20.7682% 0.039824 265.754874 / 0.8)'
    case 'coffee':
      return 'oklch(21.6758% 0.023072 329.708637 / 0.8)'
    case 'winter':
      return 'oklch(1 0 0 / 0.8)'
    case 'dim':
      return 'oklch(30.8577% 0.023243 264.149498 / 0.8)'
    case 'nord':
      return 'oklch(95.1276% 0.007445 260.731539 / 0.8)'
    case 'sunset':
      return 'oklch(22% 0.019 237.69 / 0.8)'
    case 'caramellatte':
      return 'oklch(98% 0.016 73.684)'
    case 'abyss':
      return 'oklch(20% 0.08 209)'
    case 'silk':
      return 'oklch(97% 0.0035 67.78)'
    default:
      return system === 'dark'
        ? 'oklch(25.3267% 0.015896 252.417568 / 0.8)'
        : 'oklch(1 0 0 / 0.8)'
  }
}

const getColor = async (image: string, index: number, setColors: Dispatch<SetStateAction<string[]>>) => {
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
