"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { api, ApiError } from "@/lib/api/client";
import { CustomerAddress, CustomerAddressInput } from "@/types/api";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const emptyForm: CustomerAddressInput = {
  label: "Home",
  full_name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  area: "",
  city: "",
  postal_code: "",
  country: "Bangladesh",
  is_default: false,
};

export default function AddressesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [form, setForm] = useState<CustomerAddressInput>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      setAddresses(await api.getAddresses());
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : "Unable to load addresses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    if (isAuthenticated) void loadAddresses();
  }, [authLoading, isAuthenticated, router]);

  const updateField = (field: keyof CustomerAddressInput, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveAddress = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await api.createAddress(form);
      setForm(emptyForm);
      await loadAddresses();
      setMessage("Address saved.");
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : "Unable to save address.");
    } finally {
      setSaving(false);
    }
  };

  const removeAddress = async (id: string) => {
    setError(null);
    try {
      await api.deleteAddress(id);
      await loadAddresses();
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : "Unable to delete address.");
    }
  };

  if (authLoading || loading) {
    return <div className="max-w-3xl mx-auto py-12 animate-pulse"><div className="h-64 bg-surface-muted rounded" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-lumera-text">Saved Addresses</h1>
        <p className="text-xs text-lumera-text-muted mt-1">Manage delivery details for future orders.</p>
      </div>
      {message && <Alert variant="success" title="Saved">{message}</Alert>}
      {error && <Alert variant="danger" title="Address error">{error}</Alert>}

      <Card className="p-6">
        <h2 className="text-sm font-semibold text-lumera-text mb-4">Add an address</h2>
        <form onSubmit={saveAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {([
            ["label", "Label"], ["full_name", "Recipient name"], ["phone", "Phone"],
            ["address_line1", "Address line"], ["address_line2", "Address line 2"],
            ["area", "Area"], ["city", "City"], ["postal_code", "Postal code"], ["country", "Country"],
          ] as const).map(([field, label]) => (
            <label key={field} className="text-xs text-lumera-text-muted">
              <span className="block mb-1">{label}</span>
              <input
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-lumera-text"
                value={(form[field] as string) || ""}
                onChange={(event) => updateField(field, event.target.value)}
                required={["full_name", "phone", "address_line1", "city", "country"].includes(field)}
              />
            </label>
          ))}
          <label className="sm:col-span-2 flex items-center gap-2 text-xs text-lumera-text">
            <input type="checkbox" checked={!!form.is_default} onChange={(event) => updateField("is_default", event.target.checked)} />
            Make this my default address
          </label>
          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" isLoading={saving}>Save address</Button>
          </div>
        </form>
      </Card>

      <div className="space-y-3">
        {addresses.length === 0 ? (
          <Card className="p-6 text-sm text-lumera-text-muted">No saved addresses yet.</Card>
        ) : addresses.map((address) => (
          <Card key={address.id} className="p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="text-sm text-lumera-text">
              <div className="flex items-center gap-2 mb-1">
                <strong>{address.label || "Address"}</strong>
                {address.is_default && <span className="text-[10px] rounded bg-emerald-50 text-emerald-700 px-2 py-0.5">Default</span>}
              </div>
              <p>{address.full_name} · {address.phone}</p>
              <p>{address.address_line1}{address.address_line2 ? `, ${address.address_line2}` : ""}</p>
              <p>{[address.area, address.city, address.postal_code].filter(Boolean).join(", ")}</p>
              <p>{address.country}</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => removeAddress(address.id)}>Delete</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
