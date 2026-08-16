import fs from 'node:fs'
import path from 'node:path'
import { Document, Page, View, Text, Image, StyleSheet, renderToBuffer } from '@react-pdf/renderer'
import { parseLocalDate } from './date-utils'
import { formatCPF } from './utils'
import type { DiplomaEmitido } from '@/types'

// react-pdf's image decoder só suporta PNG/JPEG (sem webp) — os logos precisam
// estar num desses formatos. ipes-logo.png é uma conversão do ipes-logo.webp.
const IPES_LOGO = fs.readFileSync(path.join(process.cwd(), 'public', 'ipes-logo.png'))
const CAIXA_LOGO = fs.readFileSync(path.join(process.cwd(), 'public', 'CAIXA_2cores_positiva.png'))

function fmtDiplomaDate(iso: string): string {
  return parseLocalDate(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

const styles = StyleSheet.create({
  page: {
    padding: 48,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  border: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#003087',
    padding: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  logo: { height: 48, objectFit: 'contain' },
  eyebrow: {
    marginTop: 28,
    fontSize: 10,
    letterSpacing: 2,
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 10,
    fontSize: 26,
    fontWeight: 700,
    color: '#003087',
    textAlign: 'center',
  },
  body: {
    marginTop: 28,
    fontSize: 13,
    lineHeight: 1.6,
    color: '#1F2937',
    textAlign: 'center',
    maxWidth: 480,
  },
  studentName: { fontWeight: 700 },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
  },
  signatureBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 220,
  },
  signatureImage: { height: 44, objectFit: 'contain', marginBottom: 4 },
  signatureLine: { borderTopWidth: 1, borderTopColor: '#1F2937', width: '100%', paddingTop: 4 },
  signatureName: { fontSize: 10, fontWeight: 700, textAlign: 'center' },
  signatureLabel: { fontSize: 8, color: '#6B7280', textAlign: 'center' },
  qrBlock: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: 90 },
  qrImage: { width: 70, height: 70 },
  qrLabel: { fontSize: 6, color: '#6B7280', textAlign: 'center', marginTop: 4 },
})

function DiplomaDocument({ diploma, qrDataUrl }: { diploma: DiplomaEmitido; qrDataUrl: string }) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <View style={styles.header}>
            <Image src={IPES_LOGO} style={styles.logo} />
            <Image src={CAIXA_LOGO} style={styles.logo} />
          </View>

          <Text style={styles.eyebrow}>Catadores Digitais</Text>
          <Text style={styles.title}>{diploma.title}</Text>

          <Text style={styles.body}>
            Certificamos que <Text style={styles.studentName}>{diploma.studentName}</Text>, CPF{' '}
            {formatCPF(diploma.studentCpf)}
            {diploma.description ? `, ${diploma.description}` : ''}, em {fmtDiplomaDate(diploma.achievedDate)}, no
            curso {diploma.turmaName}.
          </Text>

          <View style={styles.footer}>
            <View style={styles.signatureBlock}>
              <Image src={diploma.coordinatorSignature} style={styles.signatureImage} />
              <View style={styles.signatureLine}>
                <Text style={styles.signatureName}>{diploma.coordinatorName}</Text>
                <Text style={styles.signatureLabel}>Coordenador(a) Geral do Curso</Text>
              </View>
            </View>

            <View style={styles.qrBlock}>
              <Image src={qrDataUrl} style={styles.qrImage} />
              <Text style={styles.qrLabel}>Verifique a autenticidade</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export async function renderDiplomaPdf(diploma: DiplomaEmitido, qrDataUrl: string): Promise<Buffer> {
  return renderToBuffer(<DiplomaDocument diploma={diploma} qrDataUrl={qrDataUrl} />)
}
