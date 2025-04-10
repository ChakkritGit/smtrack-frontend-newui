import { StyleSheet, Font } from '@react-pdf/renderer'
import AnuphanRegular from '../../../assets/fonts/Anuphan-Regular.ttf'
import AnuphanMedium from '../../../assets/fonts/Anuphan-Medium.ttf'

Font.register({
  family: 'Anuphan',
  fonts: [
    {
      src: AnuphanRegular
    },
    {
      src: AnuphanMedium
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
  headerColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5
  },
  headerTextSq: {
    fontSize: 12,
    textAlign: 'center',
    width: '33.33%'
  },
  headerTitle: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    width: '33.33%'
  },
  headerTextNumber: {
    fontSize: 12,
    textAlign: 'center',
    width: '33.33%'
  },
  headerTextSqColor: {
    fontSize: 10,
    color: 'red',
    fontWeight: 'bold'
  },
  headerTextNumberColor: {
    fontSize: 10,
    color: 'red',
    fontWeight: 'bold'
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    gap: 5
  },
  contactColumn: {
    flexDirection: 'column',
    gap: 2
  },
  contactCompany: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  contactCompanyAddress: {
    fontSize: 10
  },
  contactNotic: {
    textAlign: 'center',
    fontWeight: 'bold',
    border: '1px',
    borderStyle: 'solid',
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 8
  },
  tableWrapper: {
    marginTop: 10,
    border: '1px',
    borderStyle: 'solid'
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1px'
  },
  tableHeaderLeft: {
    width: '50%',
    borderRight: '1px',
    padding: 5
  },
  tableHeaderRight: {
    width: '50%',
    padding: 5
  },
  customerContactColumn: {
    flexDirection: 'column',
    gap: 5
  },
  customerContactTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    fontSize: 10
  },
  customerContactText: {
    textDecoration: 'underline',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxHeight: '30px'
  },
  tableWarrantyWrapper: {
    flexDirection: 'column',
    gap: 5,
    padding: 5,
    borderBottom: '1px'
  },
  tableWarrantyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 5
  },
  wrapperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  checkBox: {
    border: '1px',
    width: '15px',
    height: '15px',
    alignItems: 'center'
  },
  warrantyText: {
    fontSize: 10
  },
  warrantyDetailMark: {
    color: 'red',
    fontSize: 14
  },
  warrantyDetail: {
    fontSize: 10,
    textDecoration: 'underline'
  },
  warrantyDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  tableDetailWrapper: {
    padding: 5,
    borderBottom: '1px'
  },
  tableDetailColumn: {
    flexDirection: 'column',
    gap: 5
  },
  tableDetailTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    fontSize: 10
  },
  tableDetailText: {
    textDecoration: 'underline',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxHeight: '30px'
  },
  tableSignatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1px'
  },
  tableSignatureLeft: {
    width: '50%',
    borderRight: '1px',
    paddingVertical: 5,
    paddingHorizontal: 15
  },
  tableSignatureRight: {
    width: '50%',
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  signatureWrapper: {
    marginTop: 18,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15
  },
  signatureLeft: {
    width: '60%',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: 10,
    gap: 5
  },
  signatureright: {
    width: '40%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 10,
    gap: 5
  },
  signatureSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  signatureDotLeft: {
    borderBottom: '1px dotted black',
    width: '90%'
  },
  signatureDotRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5
  },
  signatureItemRight: {
    flexDirection: 'row',
    width: '30%'
  },
  signatureItemRightDot: {
    borderBottom: '1px dotted black',
    width: '100%'
  },
  progressWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5
  },
  progressLeft: {
    width: '20%',
    fontSize: 10
  },
  progressRight: {
    width: '80%',
    flexDirection: 'column',
    gap: 10,
    fontSize: 10
  },
  progressItem: {
    flexDirection: 'row',
    gap: 50
  },
  wrapperProgressBox: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  progressDetail: {
    flexDirection: 'row',
    marginVertical: 10,
    gap: 10
  },
  progressDetailExplan: {
    borderBottom: '1px dotted black',
    width: '100%'
  },
  progressDetailWrapper: {
    flexDirection: 'column',
    marginVertical: 10,
    padding: 5,
    fontSize: 10,
    gap: 10
  },
  footerWrapper: {
    marginTop: 5,
    border: '1px',
    borderStyle: 'solid',
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLeft: {
    width: '50%',
    paddingVertical: 5,
    paddingHorizontal: 15
  },
  footerRight: {
    width: '50%',
    paddingVertical: 5,
    paddingHorizontal: 15
  },
  notic: {
    position: 'absolute',
    bottom: 30,
    left: 35,
    right: 35,
    fontSize: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  noticText: {
    color:'red',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  noticTextBold: {
    fontSize: 12,
    fontWeight: 'bold'
  }
})

export { style }
