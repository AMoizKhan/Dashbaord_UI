import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getInvoices, deleteInvoice } from "@/lib/storage";
import { formatCurrency, formatDate } from "@/lib/invoice";
import { Invoice } from "@/types/invoice";
import { Plus, Search, Eye, Trash2, Download, FileText } from "lucide-react";
import { generateInvoicePDFWithJSPDF } from "@/lib/pdf";
import { toast } from "sonner";

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [invoices, searchTerm]);

  const loadInvoices = () => {
    try {
      const savedInvoices = getInvoices();
      setInvoices(savedInvoices);
    } catch (error) {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const filterInvoices = () => {
    if (!searchTerm) {
      setFilteredInvoices(invoices);
      return;
    }

    const filtered = invoices.filter(
      (invoice) =>
        invoice.invoiceNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.client.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredInvoices(filtered);
  };

  const handleDeleteInvoice = async (id: string) => {
    try {
      deleteInvoice(id);
      setInvoices(invoices.filter((inv) => inv.id !== id));
      toast.success("Invoice deleted successfully");
    } catch (error) {
      toast.error("Failed to delete invoice");
    }
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      generateInvoicePDFWithJSPDF(invoice);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      toast.error("Failed to generate PDF");
    }
  };

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "sent":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "overdue":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "draft":
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">All Invoices</h1>
            <p className="text-muted-foreground">
              Manage and track all your invoices
            </p>
          </div>
          <Link to="/create">
            <Button size="lg" className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create Invoice</span>
            </Button>
          </Link>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search invoices by number, client name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoices List */}
        <Card>
          <CardHeader>
            <CardTitle>Invoices ({filteredInvoices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {searchTerm ? "No invoices found" : "No invoices yet"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Create your first invoice to get started"}
                </p>
                {!searchTerm && (
                  <Link to="/create">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Invoice
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium">{invoice.invoiceNumber}</h4>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(invoice.status)}
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {invoice.client.name} • {invoice.client.email}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Created: {formatDate(invoice.date)} • Due:{" "}
                        {formatDate(invoice.dueDate)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency(invoice.total)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Link to={`/invoice/${invoice.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadPDF(invoice)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Invoices;
