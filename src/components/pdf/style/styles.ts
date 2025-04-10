import { StyleSheet, Font } from '@react-pdf/renderer'
import AnuphanRegular from '../../../assets/fonts/Anuphan-Regular.ttf'

Font.register({
  family: 'Anuphan',
  fonts: [
    {
      src: AnuphanRegular
    }
  ]
})

const StylesPdf = StyleSheet.create({
  body: {
    fontFamily: 'Anuphan',
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  Head: {
    flexDirection: 'row',
    fontSize: 12,
    marginBottom: 20
  },
  left: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 800
  },
  right: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  tag: {
    fontWeight: 'bold'
  },
  img: {
    objectFit: 'contain',
    aspectRatio: 70 / 80,
    width: 70,
    height: 80,
    maxWidth: 100,
    maxHeight: 100,
    padding: 3
  },
  left_row: {
    fontSize: 12
  },
  Body_img: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  img_width: {
    objectFit: 'contain',
    aspectRatio: 750 / 320,
    width: 750,
    height: 320
  }
})

export { StylesPdf }
