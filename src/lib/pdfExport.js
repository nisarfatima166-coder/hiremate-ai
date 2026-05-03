function safeFilePart(s) {
  return String(s ?? '')
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 60)
}

/**
 * Export a DOM element to PDF (client-side).
 * Uses html2pdf.js (html2canvas + jsPDF) under the hood.
 */
export async function exportElementToPdf(element, { filename } = {}) {
  if (!element) throw new Error('Missing element to export')

  const { default: html2pdf } = await import('html2pdf.js')

  const finalName = safeFilePart(filename) || 'resume'

  // A4, portrait. Scale improves text sharpness.
  return html2pdf()
    .set({
      filename: `${finalName}.pdf`,
      margin: [12, 12, 12, 12],
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    })
    .from(element)
    .save()
}

