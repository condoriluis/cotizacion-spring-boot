import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    color: '#334155',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 20,
  },
  companyInfo: {
    flexDirection: 'column',
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  quotationTitle: {
    fontSize: 24,
    fontWeight: 'black',
    color: '#047857',
    textAlign: 'right',
  },
  folio: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'right',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  clientInfo: {
    fontSize: 12,
    color: '#1e293b',
    fontWeight: 'bold',
  },
  table: {
    display: 'flex',
    width: 'auto',
    marginTop: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingVertical: 8,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f8fafc',
    borderBottomWidth: 2,
    borderBottomColor: '#e2e8f0',
  },
  col1: { width: '40%' },
  col2: { width: '20%', textAlign: 'center' },
  col3: { width: '20%', textAlign: 'right' },
  col4: { width: '20%', textAlign: 'right' },
  headerText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  itemText: {
    fontSize: 10,
    color: '#334155',
  },
  totalSection: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalBox: {
    width: 200,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    marginTop: 8,
    paddingTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#047857',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 20,
  }
});

interface QuotationPDFProps {
  quotation: any;
}

const QuotationPDF = ({ quotation }: QuotationPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>SISTEMA COTIZADOR</Text>
          <Text>Calle Innovación #123</Text>
          <Text>Ciudad de La Paz, CP 01000</Text>
          <Text>RFC: ABC123456XYZ</Text>
        </View>
        <View>
          <Text style={styles.quotationTitle}>COTIZACIÓN</Text>
          <Text style={styles.folio}>Folio #{1000 + quotation.id}</Text>
          <Text style={{ textAlign: 'right', marginTop: 4, color: '#64748b' }}>
            Fecha: {new Date(quotation.fecha).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Client Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preparado para</Text>
        <Text style={styles.clientInfo}>{quotation.clientNombre}</Text>
      </View>

      {/* Table */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={styles.col1}><Text style={styles.headerText}>Descripción</Text></View>
          <View style={styles.col2}><Text style={styles.headerText}>Cant.</Text></View>
          <View style={styles.col3}><Text style={styles.headerText}>Precio Unit.</Text></View>
          <View style={styles.col4}><Text style={styles.headerText}>Subtotal</Text></View>
        </View>

        {quotation.items?.map((item: any, index: number) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.col1}><Text style={styles.itemText}>{item.productNombre}</Text></View>
            <View style={styles.col2}><Text style={styles.itemText}>{item.cantidad}</Text></View>
            <View style={styles.col3}><Text style={styles.itemText}>${item.precioUnitario.toLocaleString()}</Text></View>
            <View style={styles.col4}><Text style={styles.itemText}>${(item.precioUnitario * item.cantidad).toLocaleString()}</Text></View>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totalSection}>
        <View style={styles.totalBox}>
          <View style={styles.totalRow}>
            <Text style={{ color: '#64748b' }}>Subtotal</Text>
            <Text style={{ fontWeight: 'bold' }}>${quotation.total.toLocaleString()}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={{ color: '#64748b' }}>IVA (0%)</Text>
            <Text style={{ fontWeight: 'bold' }}>$0.00</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text>Total</Text>
            <Text>${quotation.total.toLocaleString()} BOB</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Esta cotización tiene una vigencia de 15 días naturales a partir de su fecha de emisión.</Text>
        <Text style={{ marginTop: 4 }}>Gracias por su confianza.</Text>
      </View>
    </Page>
  </Document>
);

export default QuotationPDF;
