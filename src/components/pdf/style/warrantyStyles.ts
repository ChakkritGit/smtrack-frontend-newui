import { StyleSheet, Font } from '@react-pdf/renderer'
import AnuphanRegular from '../../../assets/fonts/Anuphan-Regular.ttf'
import AnuphanBold from '../../../assets/fonts/Anuphan-Bold.ttf'

Font.register({
  family: 'Anuphan',
  fonts: [
    {
      src: AnuphanRegular
    },
    {
      src: AnuphanBold
    }
  ]
})

const style = StyleSheet.create({
  body: {
    fontFamily: 'Anuphan',
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35
  },
  sectionOneWrapper: {
    border: '1px',
    padding: 10
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  headImage: {
    aspectRatio: 1/1,
    objectFit: 'contain',
    width: '64px',
    height: '64px'
  },
  headText: {
    fontSize: 12,
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 3
  },
  secondHeaderTextColumn: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10
  },
  secondHeaderTextRow: {
    fontWeight: 'bold',
    width: '50%',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  secondHeaderTextTwo: {
    width: '50%',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  contentWrapperRow: {
    marginTop: 20,
    fontSize: 10,
    paddingHorizontal: 20,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  contentWrapperColumn: {
    width: '50%',
    flexDirection: 'column',
    gap: 10
  },
  contactWrapperRow: {
    marginTop: 15,
    fontSize: 10,
    paddingHorizontal: 20,
    gap: 10,
    flexDirection: 'column'
  },
  contactItemOne: {
    width: '70%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10
  },
  notice: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  sectionTwoWrapper: {
    border: '1px',
    padding: 10,
    marginTop: 10
  },
  sectionTwoHead: {
    fontSize: 12,
    fontWeight: 'bold',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3
  },
  warrantyCondition: {
    fontSize: 10,
    flexDirection: 'column',
    gap: 7,
    marginTop: 10,
    paddingHorizontal: 30
  },
  warrantyNumberfour: {
    marginLeft: 20,
    flexDirection: 'column',
    gap: 5
  },
  warrantyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10
  },
  footerBannerWrapper: {
    width: '15%'
  },
  footerText: {
    fontSize: 10,
    flexDirection: 'column',
    gap: 5
  },
  footerImage: {
    width: '15%',
    objectFit: 'contain'
  }
})

export { style }
