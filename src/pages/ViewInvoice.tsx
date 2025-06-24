import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { InvoicePreview } from "@/components/InvoicePreview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getInvoiceById, saveInvoice } from "@/lib/storage";
import { generateInvoicePDFWithJSPDF } from "@/lib/pdf";
import { Invoice } from "@/types/invoice";
import {
  ArrowLeft,
  Download,
  Edit,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

const ViewInvoice = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundInvoice = getInvoiceById(id);
      setInvoice(foundInvoice);
    }
    setLoading(false);
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!invoice) return;
    try {
      generateInvoicePDFWithJSPDF(invoice);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      toast.error("Failed to generate PDF");
    }
  };

  const handleStatusChange = (newStatus: Invoice["status"]) => {
    if (!invoice) return;
    try {
      const updatedInvoice = { ...invoice, status: newStatus };
      saveInvoice(updatedInvoice);
      setInvoice(updatedInvoice);
      toast.success(`Invoice marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update invoice status");
    }
  };

  const getStatusIcon = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4" />;
      case "sent":
        return <Send className="w-4 h-4" />;
      case "overdue":
        return <AlertTriangle className="w-4 h-4" />;
      case "draft":
      default:
        return <Clock className="w-4 h-4" />;
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

  if (!invoice) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Invoice Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The invoice you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/")}>Go to Dashboard</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-foreground">
                  Invoice {invoice.invoiceNumber}
                </h1>
                <Badge
                  variant="secondary"
                  className={`flex items-center space-x-1 ${getStatusColor(invoice.status)}`}
                >
                  {getStatusIcon(invoice.status)}
                  <span className="capitalize">{invoice.status}</span>
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Created on {new Date(invoice.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Status Actions */}
            {invoice.status === "draft" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("sent")}
                className="flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Mark as Sent</span>
              </Button>
            )}
            {invoice.status === "sent" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("paid")}
                className="flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark as Paid</span>
              </Button>
            )}

            {/* Action Buttons */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/edit/${invoice.id}`)}
              className="flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </Button>
            <Button
              size="sm"
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </Button>
          </div>
        </div>

        {/* Invoice Preview */}
        <div className="bg-muted/30 p-4 rounded-lg">
          <InvoicePreview invoice={invoice} />
        </div>
      </div>
    </Layout>
  );
};

export default ViewInvoice;
