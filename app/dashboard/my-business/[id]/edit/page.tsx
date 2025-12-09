"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { getBusinessById, updateBusiness, uploadBusinessImage } from "@/lib/api/requests";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Business {
  id: string;
  name: string;
  description: string;
  short_description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  instagram: string;
  cover_image: string;
  images: string[];
  price_range: number;
  is_open_24h: boolean;
  hours: any;
}

export default function EditBusinessPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const businessId = params.id as string;
        const data = await getBusinessById(businessId);
        setBusiness(data.business);
        setCoverImagePreview(data.business.cover_image);
      } catch (error) {
        console.error("❌ Error:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar el negocio",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBusiness();
    }
  }, [params.id, toast]);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    setSaving(true);
    try {
      let coverImageUrl = business.cover_image;

      // Upload new cover image if selected
      if (coverImageFile) {
        console.log("📤 Subiendo nueva imagen de portada...");
        const uploadResult = await uploadBusinessImage(coverImageFile);
        coverImageUrl = uploadResult.url;
        console.log("✅ Imagen subida:", coverImageUrl);
      }

      // Update business
      const updateData = {
        ...business,
        cover_image: coverImageUrl,
      };

      await updateBusiness(business.id, updateData);

      toast({
        title: "¡Éxito!",
        description: "Negocio actualizado correctamente",
      });

      router.push(`/dashboard/my-business/${business.id}`);
    } catch (error) {
      console.error("❌ Error:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el negocio",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (
    field: keyof Business,
    value: string | number | boolean
  ) => {
    if (!business) return;
    setBusiness({ ...business, [field]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Negocio no encontrado</h1>
        <Button onClick={() => router.push("/dashboard/my-business")}>
          Volver a mis negocios
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push(`/dashboard/my-business/${business.id}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al dashboard
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre del negocio *</Label>
              <Input
                id="name"
                value={business.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="short_description">Descripción corta *</Label>
              <Input
                id="short_description"
                value={business.short_description}
                onChange={(e) => handleInputChange("short_description", e.target.value)}
                maxLength={100}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción completa *</Label>
              <Textarea
                id="description"
                value={business.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={5}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Dirección *</Label>
              <Input
                id="address"
                value={business.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={business.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+56912345678"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={business.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="website">Sitio web</Label>
              <Input
                id="website"
                type="url"
                value={business.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://ejemplo.com"
              />
            </div>

            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={business.instagram}
                onChange={(e) => handleInputChange("instagram", e.target.value)}
                placeholder="@tunegocio"
              />
            </div>
          </CardContent>
        </Card>

        {/* Cover Image */}
        <Card>
          <CardHeader>
            <CardTitle>Imagen de Portada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {coverImagePreview && (
              <div className="relative">
                <img
                  src={coverImagePreview}
                  alt="Portada"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setCoverImagePreview("");
                    setCoverImageFile(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div>
              <Label htmlFor="cover_image">Cambiar imagen de portada</Label>
              <Input
                id="cover_image"
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Price Range */}
        <Card>
          <CardHeader>
            <CardTitle>Rango de Precios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant={business.price_range === value ? "default" : "outline"}
                  onClick={() => handleInputChange("price_range", value)}
                >
                  {"$".repeat(value)}
                </Button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Selecciona el rango de precios de tu negocio
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/dashboard/my-business/${business.id}`)}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar cambios
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
