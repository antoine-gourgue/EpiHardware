import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer'
import { getCurrentUser } from '@/lib/session'
import { getOrderById } from '@/lib/data/orders'

export const runtime = 'nodejs'

const BRAND = '#4f4ee6'
const SLATE = '#0f172a'
const MUTED = '#64748b'

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, color: SLATE, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  brand: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: BRAND },
  brandSub: { fontSize: 9, color: MUTED, marginTop: 2 },
  invoiceLabel: { fontSize: 16, fontFamily: 'Helvetica-Bold', textAlign: 'right' },
  ref: { fontSize: 10, color: MUTED, textAlign: 'right', marginTop: 2 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#e2e8f0', marginVertical: 20 },
  section: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  col: { flexDirection: 'column' },
  label: { fontSize: 8, color: MUTED, textTransform: 'uppercase', marginBottom: 4 },
  value: { fontSize: 10 },
  bold: { fontFamily: 'Helvetica-Bold' },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4
  },
  th: { fontSize: 8, color: MUTED, textTransform: 'uppercase', fontFamily: 'Helvetica-Bold' },
  row: {
    flexDirection: 'row',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  cName: { flex: 4 },
  cQty: { flex: 1, textAlign: 'center' },
  cPrice: { flex: 1.4, textAlign: 'right' },
  cTotal: { flex: 1.4, textAlign: 'right' },
  totals: { marginTop: 20, marginLeft: 'auto', width: 220 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  grandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0'
  },
  grand: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: BRAND },
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: MUTED,
    fontSize: 8
  }
})

const eur = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { id } = await params
  const order = await getOrderById(id, user)
  if (!order) return new Response('Not found', { status: 404 })

  const date = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(
    new Date(order.createdAt)
  )

  const doc = (
    <Document title={`Facture ${order.reference}`} author="EpiHardware">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>EpiHardware</Text>
            <Text style={styles.brandSub}>Composants & périphériques PC</Text>
          </View>
          <View>
            <Text style={styles.invoiceLabel}>FACTURE</Text>
            <Text style={styles.ref}>{order.reference}</Text>
            <Text style={styles.ref}>{date}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.col}>
            <Text style={styles.label}>Facturé à</Text>
            <Text style={[styles.value, styles.bold]}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Statut</Text>
            <Text style={[styles.value, styles.bold]}>{order.status}</Text>
          </View>
        </View>

        <View style={styles.tableHead}>
          <Text style={[styles.th, styles.cName]}>Produit</Text>
          <Text style={[styles.th, styles.cQty]}>Qté</Text>
          <Text style={[styles.th, styles.cPrice]}>Prix unitaire</Text>
          <Text style={[styles.th, styles.cTotal]}>Total</Text>
        </View>

        {order.items.map((it) => (
          <View style={styles.row} key={it.id}>
            <Text style={styles.cName}>{it.name}</Text>
            <Text style={styles.cQty}>{it.quantity}</Text>
            <Text style={styles.cPrice}>{eur(it.unitPrice)}</Text>
            <Text style={styles.cTotal}>{eur(it.unitPrice * it.quantity)}</Text>
          </View>
        ))}

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={{ color: MUTED }}>Sous-total</Text>
            <Text>{eur(order.total)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={{ color: MUTED }}>Livraison</Text>
            <Text>Offerte</Text>
          </View>
          <View style={styles.grandRow}>
            <Text style={styles.grand}>Total TTC</Text>
            <Text style={styles.grand}>{eur(order.total)}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Merci pour votre confiance — EpiHardware · Facture générée automatiquement.
        </Text>
      </Page>
    </Document>
  )

  const buffer = await renderToBuffer(doc)
  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="facture-${order.reference}.pdf"`
    }
  })
}
