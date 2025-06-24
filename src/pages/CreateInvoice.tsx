import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { InvoiceForm } from "@/components/InvoiceForm";
import { Invoice } from "@/types/invoice";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CreateInvoice = () => {
  const navigate = useNavigate();

  const handleSave = (invoice: Invoice) => {
    navigate(`/invoice/${invoice.id}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Create New Invoice
            </h1>
            <p className="text-muted-foreground">
              Fill in the details below to create a new invoice
            </p>
          </div>
        </div>

        <InvoiceForm onSave={handleSave} />
      </div>
    </Layout>
  );
};

export default CreateInvoice;
