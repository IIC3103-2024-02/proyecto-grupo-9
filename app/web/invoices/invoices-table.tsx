"use client";

import React, { useState } from "react";
import { getInvoicesAsync } from "@/lib/soap"; // Asegúrate de que esta función esté correctamente implementada.

export async function InvoicesTable() {
  type InvoiceStatus = 'pending' | 'paid';
  type InvoiceSide = 'supplier' | 'client';
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus>('pending');  
  const [sideFilter, setSideFilter] = useState<InvoiceSide>('supplier');  
  const [fromDateFilter, setFromDateFilter] = useState<string>("");
  const [toDateFilter, setToDateFilter] = useState<string>("");
  const [invoices, setInvoices] = useState<any[]>([]); // Estado para almacenar las facturas


  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value as InvoiceStatus); 
  };  

  
  const handleSideChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSideFilter(event.target.value as InvoiceSide);
  };

  const handleApplyFilters = async () => {
    try {
      const response = await getInvoicesAsync({
        status: statusFilter,
        side: sideFilter,
        fromDate: fromDateFilter,
        toDate: toDateFilter,
      });
      setInvoices(response); // Actualiza el estado con las facturas obtenidas
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  return (
    <section className="container px-4 mx-auto">
      <div className="flex flex-col">
        {/* Sección de Filtros */}
        <div className="flex items-center justify-between p-4">
          <div className="flex gap-x-4">
            <div className="flex flex-col">
              <label htmlFor="status" className="text-sm font-medium text-gray-900 dark:text-gray-400">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="mt-1 block w-full px-4 py-2 text-sm text-gray-500 dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700 bg-white border rounded-md"
              >
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="side" className="text-sm font-medium text-gray-900 dark:text-gray-400">
                Side
              </label>
              <select
                value={sideFilter}
                onChange={handleSideChange}
                className="mt-1 block w-full px-4 py-2 text-sm text-gray-500 dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700 bg-white border rounded-md"
              >
                <option value="supplier">Supplier</option>
                <option value="client">Client</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="fromDate" className="text-sm font-medium text-gray-900 dark:text-gray-400">
                From Date
              </label>
              <input
                type="date"
                value={fromDateFilter}
                onChange={(e) => setFromDateFilter(e.target.value)}
                className="mt-1 block w-full px-4 py-2 text-sm text-gray-500 dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700 bg-white border rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="toDate" className="text-sm font-medium text-gray-900 dark:text-gray-400">
                To Date
              </label>
              <input
                type="date"
                value={toDateFilter}
                onChange={(e) => setToDateFilter(e.target.value)}
                className="mt-1 block w-full px-4 py-2 text-sm text-gray-500 dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700 bg-white border rounded-md"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleApplyFilters}
            className="bg-blue-600 text-white px-6 py-2 rounded-md mt-4 md:mt-0"
          >
            Apply Filters
          </button>
        </div>

        {/* Tabla de Facturas */}
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Invoice ID</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td className="px-4 py-4 text-sm text-gray-900">{invoice.id}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{invoice.status}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{invoice.total}</td>
                    </tr>
                  ))}
                  {invoices.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center px-4 py-4 text-sm text-gray-500">
                        No invoices found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
