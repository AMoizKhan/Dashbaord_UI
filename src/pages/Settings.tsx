import React from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Database, Download } from "lucide-react";

const Settings = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage your app preferences and data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SettingsIcon className="w-5 h-5" />
                <span>General Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Customize your invoice app experience with general preferences.
              </p>
              <Button variant="outline" className="w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Data Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Export your data or clear all stored information.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="destructive" className="w-full">
                  Clear All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>About InvoiceFlow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              InvoiceFlow is a modern, easy-to-use invoice generator that helps
              you create professional invoices, track payments, and manage your
              business finances. All data is stored locally in your browser for
              privacy and convenience.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
