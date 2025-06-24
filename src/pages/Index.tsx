import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getInvoices, deleteInvoice } from "@/lib/storage";
import { formatCurrency, formatDate } from "@/lib/invoice";
import { Invoice } from "@/types/invoice";
import {
  Plus,
  FileText,
  DollarSign,
  Clock,
  Eye,
  Trash2,
  Download,
} from "lucide-react";
import { generateInvoicePDFWithJSPDF } from "@/lib/pdf";
import { toast } from "sonner";

const Index = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

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

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = totalAmount - paidAmount;

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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your invoices and track your business
            </p>
          </div>
          <Link to="/create">
            <Button size="lg" className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create Invoice</span>
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalAmount)}
              </div>
              <p className="text-xs text-muted-foreground">
                From {invoices.length} invoices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(paidAmount)}
              </div>
              <p className="text-xs text-muted-foreground">
                {invoices.filter((inv) => inv.status === "paid").length}{" "}
                invoices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {formatCurrency(pendingAmount)}
              </div>
              <p className="text-xs text-muted-foreground">
                {invoices.filter((inv) => inv.status !== "paid").length}{" "}
                invoices
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Invoices
              <Link to="/invoices">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No invoices yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Create your first invoice to get started
                </p>
                <Link to="/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Invoice
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.slice(0, 5).map((invoice) => (
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
                        {invoice.client.name} • {formatDate(invoice.date)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency(invoice.total)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Due {formatDate(invoice.dueDate)}
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

export default Index;
