'use client'

import { useState } from 'react'
import { X, FileText, DollarSign, Calendar, Download, CreditCard, Printer } from 'lucide-react'
import { markInvoiceAsPaid, deleteInvoice } from '@/lib/firestore'
import type { Invoice } from '@/types/crm'

interface InvoiceDetailsModalProps {
  invoice: Invoice
  onClose: () => void
  onSuccess: () => void
}

export default function InvoiceDetailsModal({ invoice, onClose, onSuccess }: InvoiceDetailsModalProps) {
  const [marking, setMarking] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleMarkAsPaid = async () => {
    if (!confirm('¿Marcar esta factura como pagada?')) return

    setMarking(true)
    try {
      await markInvoiceAsPaid(invoice.id, 'tarjeta', 'REF-' + Date.now())
      onSuccess()
      alert('Factura marcada como pagada')
      onClose()
    } catch (error) {
      console.error('Error al marcar factura como pagada:', error)
      alert('Error al marcar factura como pagada')
    } finally {
      setMarking(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar esta factura? Esta acción no se puede deshacer.')) return

    setDeleting(true)
    try {
      await deleteInvoice(invoice.id)
      onSuccess()
      alert('Factura eliminada')
      onClose()
    } catch (error) {
      console.error('Error al eliminar factura:', error)
      alert('Error al eliminar factura')
    } finally {
      setDeleting(false)
    }
  }

  const handleGeneratePDF = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Factura ${invoice.invoiceId}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
              .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #4F46E5; }
              .company { font-size: 24px; font-weight: bold; color: #4F46E5; }
              .invoice-info { display: flex; justify-content: space-between; margin: 20px 0; }
              .section { margin: 20px 0; }
              .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #1e293b; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { padding: 12px; border: 1px solid #e2e8f0; text-align: left; }
              th { background: #f1f5f9; font-weight: bold; }
              .total-row { background: #f8fafc; font-weight: bold; }
              .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
              .status-paid { background: #dcfce7; color: #166534; }
              .status-pending { background: #fef3c7; color: #854d0e; }
              .status-overdue { background: #fee2e2; color: #991b1b; }
              .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; }
              @media print { .no-print { display: none; } }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="company">HoyMismo Paquetería</div>
              <div style="margin-top: 10px; color: #64748b;">Sistema de gestión de paquetería</div>
            </div>

            <div class="invoice-info">
              <div>
                <strong>Factura: ${invoice.invoiceId}</strong><br>
                Fecha: ${invoice.createdAt.toDate().toLocaleDateString()}<br>
                Vencimiento: ${invoice.dueDate.toDate().toLocaleDateString()}
              </div>
              <div style="text-align: right;">
                Estado: <span class="status status-${invoice.status === 'pagada' ? 'paid' : invoice.status === 'pendiente' ? 'pending' : 'overdue'}">
                  ${invoice.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Cliente</div>
              <strong>${invoice.clientName}</strong>
            </div>

            <div class="section">
              <div class="section-title">Detalles de la Factura</div>
              <table>
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th style="text-align: center;">Cantidad</th>
                    <th style="text-align: right;">Precio Unit.</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.items.map(item => `
                    <tr>
                      <td>${item.description}</td>
                      <td style="text-align: center;">${item.quantity}</td>
                      <td style="text-align: right;">$${item.unitPrice.toFixed(2)}</td>
                      <td style="text-align: right;">$${item.total.toFixed(2)}</td>
                    </tr>
                  `).join('')}
                  <tr>
                    <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
                    <td style="text-align: right;">$${invoice.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colspan="3" style="text-align: right;"><strong>Impuestos:</strong></td>
                    <td style="text-align: right;">$${invoice.tax.toFixed(2)}</td>
                  </tr>
                  ${invoice.discount ? `
                  <tr>
                    <td colspan="3" style="text-align: right;"><strong>Descuento:</strong></td>
                    <td style="text-align: right;">-$${invoice.discount.toFixed(2)}</td>
                  </tr>
                  ` : ''}
                  <tr class="total-row">
                    <td colspan="3" style="text-align: right;"><strong>TOTAL:</strong></td>
                    <td style="text-align: right; font-size: 18px;">$${invoice.total.toFixed(2)} ${invoice.currency}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            ${invoice.paidDate ? `
            <div class="section">
              <div class="section-title">Información de Pago</div>
              <strong>Fecha de pago:</strong> ${invoice.paidDate.toDate().toLocaleDateString()}<br>
              ${invoice.paymentMethod ? `<strong>Método:</strong> ${invoice.paymentMethod}<br>` : ''}
              ${invoice.paymentReference ? `<strong>Referencia:</strong> ${invoice.paymentReference}` : ''}
            </div>
            ` : ''}

            ${invoice.notes ? `
            <div class="section">
              <div class="section-title">Notas</div>
              ${invoice.notes}
            </div>
            ` : ''}

            <div class="footer">
              <strong>HoyMismo Paquetería</strong><br>
              info@hoymismo.com | +1 (346) 555-0100<br>
              ¡Donde envías hoy... Y recibes hoy!
            </div>

            <div class="no-print" style="text-align: center; margin-top: 20px;">
              <button onclick="window.print()" style="padding: 10px 20px; background: #4F46E5; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                Imprimir / Guardar PDF
              </button>
              <button onclick="window.close()" style="padding: 10px 20px; background: #6B7280; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Cerrar
              </button>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  const statusColors = {
    pendiente: 'bg-yellow-500/20 text-yellow-400',
    pagada: 'bg-green-500/20 text-green-400',
    vencida: 'bg-red-500/20 text-red-400',
    cancelada: 'bg-slate-500/20 text-slate-400',
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Detalles de Factura</h2>
            <p className="text-slate-400 text-sm font-mono">{invoice.invoiceId}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Acciones rápidas */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleGeneratePDF}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Generar PDF
            </button>
            {invoice.status === 'pendiente' && (
              <button
                onClick={handleMarkAsPaid}
                disabled={marking}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                {marking ? 'Procesando...' : 'Marcar como Pagada'}
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors disabled:opacity-50"
            >
              {deleting ? 'Eliminando...' : 'Eliminar Factura'}
            </button>
          </div>

          {/* Estado */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Estado</p>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[invoice.status]}`}>
                  {invoice.status.toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400 mb-1">Total</p>
                <p className="text-2xl font-bold text-white">
                  ${invoice.total.toFixed(2)} {invoice.currency}
                </p>
              </div>
            </div>
          </div>

          {/* Cliente */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Cliente</h3>
            <p className="text-slate-300">{invoice.clientName}</p>
          </div>

          {/* Fechas */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="text-sm text-slate-400 mb-1">Fecha de Emisión</p>
              <p className="text-white font-semibold">
                {invoice.createdAt.toDate().toLocaleDateString()}
              </p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="text-sm text-slate-400 mb-1">Fecha de Vencimiento</p>
              <p className="text-white font-semibold">
                {invoice.dueDate.toDate().toLocaleDateString()}
              </p>
            </div>
            {invoice.paidDate && (
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400 mb-1">Fecha de Pago</p>
                <p className="text-white font-semibold">
                  {invoice.paidDate.toDate().toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h3 className="text-white font-semibold mb-3">Detalles</h3>
            <div className="space-y-2">
              {invoice.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-0">
                  <div>
                    <p className="text-white">{item.description}</p>
                    <p className="text-sm text-slate-400">
                      {item.quantity} x ${item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-white font-semibold">${item.total.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-white">${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Impuestos</span>
                <span className="text-white">${invoice.tax.toFixed(2)}</span>
              </div>
              {invoice.discount && invoice.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Descuento</span>
                  <span className="text-green-400">-${invoice.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-700">
                <span className="text-white">Total</span>
                <span className="text-white">${invoice.total.toFixed(2)} {invoice.currency}</span>
              </div>
            </div>
          </div>

          {/* Información de pago */}
          {invoice.paidDate && (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h3 className="text-white font-semibold mb-3">Información de Pago</h3>
              {invoice.paymentMethod && (
                <p className="text-sm text-slate-300">
                  <span className="text-slate-400">Método:</span> {invoice.paymentMethod}
                </p>
              )}
              {invoice.paymentReference && (
                <p className="text-sm text-slate-300">
                  <span className="text-slate-400">Referencia:</span> {invoice.paymentReference}
                </p>
              )}
            </div>
          )}

          {/* Notas */}
          {invoice.notes && (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Notas</h3>
              <p className="text-slate-300">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
