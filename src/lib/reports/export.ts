import PDFDocument from 'pdfkit'
import ExcelJS from 'exceljs'
import { createObjectCsvStringifier } from 'csv-writer'
import { ReportConfig } from '../../types/report'

interface ExportOptions {
  title: string
  data: any
  config: ReportConfig
}

export async function exportToPDF({ title, data, config }: ExportOptions): Promise<Buffer> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = []
    const doc = new PDFDocument()

    doc.on('data', chunks.push.bind(chunks))
    doc.on('end', () => resolve(Buffer.concat(chunks)))

    // Add company logo if enabled
    if (config.customization?.logo) {
      doc.image('path/to/logo.png', 50, 50, { width: 100 })
    }

    // Add title
    doc.fontSize(24).text(title, { align: 'center' })
    doc.moveDown()

    // Add summary section if enabled
    if (config.customization?.summary && data.summary) {
      doc.fontSize(16).text('Summary')
      doc.moveDown()
      Object.entries(data.summary).forEach(([key, value]) => {
        doc.fontSize(12).text(`${key}: ${value}`)
      })
      doc.moveDown()
    }

    // Add charts if enabled
    if (config.customization?.charts) {
      // Charts would be added here using a charting library
      // that supports PDF output
    }

    // Add tables if enabled
    if (config.customization?.tables && data.metrics) {
      doc.fontSize(16).text('Detailed Metrics')
      doc.moveDown()
      
      // Create table layout
      const table = {
        headers: Object.keys(data.metrics[0] || {}),
        rows: data.metrics
      }
      
      // Add table to PDF
      // Table formatting would go here
    }

    doc.end()
  })
}

export async function exportToExcel({ title, data, config }: ExportOptions): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(title)

  // Add summary sheet if enabled
  if (config.customization?.summary && data.summary) {
    const summarySheet = workbook.addWorksheet('Summary')
    Object.entries(data.summary).forEach(([key, value], index) => {
      summarySheet.getCell(`A${index + 1}`).value = key
      summarySheet.getCell(`B${index + 1}`).value = value
    })
  }

  // Add metrics data
  if (data.metrics) {
    const headers = Object.keys(data.metrics[0] || {})
    worksheet.columns = headers.map(header => ({
      header,
      key: header,
      width: 15
    }))
    worksheet.addRows(data.metrics)
  }

  return workbook.xlsx.writeBuffer()
}

export async function exportToCSV({ data }: ExportOptions): Promise<string> {
  if (!data.metrics || !data.metrics.length) {
    return ''
  }

  const csvStringifier = createObjectCsvStringifier({
    header: Object.keys(data.metrics[0]).map(key => ({
      id: key,
      title: key
    }))
  })

  const header = csvStringifier.getHeaderString()
  const records = csvStringifier.stringifyRecords(data.metrics)

  return header + records
}