import React from "react";
import { Invoice } from "@/types/invoice";
import { formatCurrency, formatDate } from "@/lib/invoice";
import { Separator } from "@/components/ui/separator";

interface InvoicePreviewProps {
  invoice: Invoice;
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  return (
    <div
      id="invoice-preview"
      className="bg-white text-black p-12 max-w-4xl mx-auto min-h-[11in] print:shadow-none shadow-lg"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
          <div className="text-sm text-gray-600">
            <div>Invoice #: {invoice.invoiceNumber}</div>
            <div>Date: {formatDate(invoice.date)}</div>
            <div>Due Date: {formatDate(invoice.dueDate)}</div>
          </div>
        </div>
      </div>

      {/* Company and Client Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">From:</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <div className="font-medium text-lg">{invoice.company.name}</div>
            <div>{invoice.company.address}</div>
            <div>
              {invoice.company.city}, {invoice.company.state}{" "}
              {invoice.company.zipCode}
            </div>
            <div>{invoice.company.country}</div>
            {invoice.company.phone && <div>Phone: {invoice.company.phone}</div>}
            <div>Email: {invoice.company.email}</div>
            {invoice.company.website && (
              <div>Website: {invoice.company.website}</div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill To:</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <div className="font-medium text-lg">{invoice.client.name}</div>
            <div>{invoice.client.address}</div>
            <div>
              {invoice.client.city}, {invoice.client.state}{" "}
              {invoice.client.zipCode}
            </div>
            <div>{invoice.client.country}</div>
            <div>Email: {invoice.client.email}</div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-12">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 text-sm font-semibold text-gray-900">
                Description
              </th>
              <th className="text-center py-3 text-sm font-semibold text-gray-900 w-20">
                Qty
              </th>
              <th className="text-right py-3 text-sm font-semibold text-gray-900 w-24">
                Rate
              </th>
              <th className="text-right py-3 text-sm font-semibold text-gray-900 w-32">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-4 text-sm text-gray-700">
                  {item.description}
                </td>
                <td className="py-4 text-center text-sm text-gray-700">
                  {item.quantity}
                </td>
                <td className="py-4 text-right text-sm text-gray-700">
                  {formatCurrency(item.rate)}
                </td>
                <td className="py-4 text-right text-sm text-gray-700 font-medium">
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64">
          <div className="space-y-3">
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-700">Subtotal:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(invoice.subtotal)}
              </span>
            </div>
            {invoice.taxRate > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-700">
                  Tax ({invoice.taxRate}%):
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(invoice.taxAmount)}
                </span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-gray-900">
                  Total:
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(invoice.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes:</h3>
          <div className="text-sm text-gray-700 leading-relaxed">
            {invoice.notes}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">Thank you for your business!</p>
      </div>
    </div>
  );
}
