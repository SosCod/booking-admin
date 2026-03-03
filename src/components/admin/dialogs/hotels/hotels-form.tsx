'use client';

import * as React from 'react';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/src/components/admin/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/admin/ui/form';
import { Input } from '@/src/components/admin/ui/input';
import { Textarea } from '@/src/components/admin/ui/textarea';
import { Badge } from '@/src/components/admin/ui/badge';
import {
  Wifi,
  Waves,
  Dumbbell,
  Utensils,
  Car,
  Coffee,
  Beer,
  Wind,
  Flower2,
  Tv,
  Check,
  X,
} from 'lucide-react';
import { createHotels, updateHotel } from '@/src/services/hotels.api';
import { UploadButton } from '@/src/utils/uploadthing';

const AVAILABLE_AMENITIES = [
  { id: 'WiFi', icon: Wifi },
  { id: 'Piscina', icon: Waves },
  { id: 'Gimnasio', icon: Dumbbell },
  { id: 'Restaurante', icon: Utensils },
  { id: 'Estacionamiento', icon: Car },
  { id: 'Desayuno', icon: Coffee },
  { id: 'Bar', icon: Beer },
  { id: 'Aire Acondicionado', icon: Wind },
  { id: 'Spa', icon: Flower2 },
  { id: 'TV', icon: Tv },
];

type HotelFormData = {
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  amenities: string[];
};

export function HotelsForm({
  onSuccess,
  initialData,
}: {
  onSuccess?: () => void;
  initialData?: any;
}) {
  const form = useForm<HotelFormData>({
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          address: initialData.address,
          city: initialData.city,
          country: initialData.country,
          amenities: initialData.amenities || [],
        }
      : {
          amenities: [],
        },
  });

  const [uploadedImageUrls, setUploadedImageUrls] = React.useState<string[]>(
    initialData?.images || [],
  );
  const [isUploading, setIsUploading] = React.useState(false);

  const onSubmit: SubmitHandler<HotelFormData> = async (data) => {
    if (uploadedImageUrls.length === 0) {
      alert('Por favor, sube al menos una imagen.');
      return;
    }

    try {
      const hotelData = {
        ...data,
        images: uploadedImageUrls,
        rating: initialData?.rating || 0,
        totalReviews: initialData?.totalReviews || 0,
      };

      if (initialData) {
        await updateHotel(initialData.id, hotelData);
        alert('¡Hotel actualizado con éxito!');
      } else {
        await createHotels(hotelData);
        alert('¡Hotel creado con éxito!');
        form.reset();
        setUploadedImageUrls([]);
      }
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Hubo un error al procesar el hotel.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Hotel</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Grand Hyatt" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe el hotel..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input placeholder="Av. Principal 123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciudad</FormLabel>
                <FormControl>
                  <Input placeholder="Cuzco" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>País</FormLabel>
              <FormControl>
                <Input placeholder="Perú" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amenities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amenidades del Hotel</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-slate-50/50">
                  {AVAILABLE_AMENITIES.map((amenity) => {
                    const Icon = amenity.icon;
                    const isSelected = field.value?.includes(amenity.id);
                    return (
                      <Badge
                        key={amenity.id}
                        variant={isSelected ? 'default' : 'outline'}
                        className={`cursor-pointer py-2 px-3 flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-600'
                            : 'bg-white hover:bg-slate-100'
                        }`}
                        onClick={() => {
                          const currentValues = field.value || [];
                          const nextValues = isSelected
                            ? currentValues.filter((v) => v !== amenity.id)
                            : [...currentValues, amenity.id];
                          field.onChange(nextValues);
                        }}
                      >
                        <Icon className="w-4 h-4" />
                        {amenity.id}
                        {isSelected && <Check className="w-3 h-3 ml-1" />}
                      </Badge>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Imágenes del Hotel</FormLabel>
          <div className="flex flex-wrap gap-4">
            {uploadedImageUrls.map((url, index) => (
              <div key={index} className="relative group">
                <Image
                  src={url}
                  alt={`Imagen ${index + 1}`}
                  width={100}
                  height={100}
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() =>
                    setUploadedImageUrls((prev) =>
                      prev.filter((_, i) => i !== index),
                    )
                  }
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="w-24 h-24 flex items-center justify-center border-2 border-dashed rounded-lg">
              <UploadButton
                endpoint="hotelImageUploader"
                onClientUploadComplete={(res) => {
                  if (res) {
                    const urls = res.map(
                      (f) => f.ufsUrl || (f.serverData as any)?.fileUrl,
                    );
                    setUploadedImageUrls((prev) => [...prev, ...urls]);
                    alert('Imágenes subidas correctamente.');
                  }
                  setIsUploading(false);
                }}
                onUploadProgress={() => setIsUploading(true)}
                onUploadError={(error) => {
                  alert(`Error: ${error.message}`);
                  setIsUploading(false);
                }}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isUploading || uploadedImageUrls.length === 0}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold h-12"
        >
          {isUploading
            ? 'Subiendo imágenes...'
            : initialData
              ? 'Actualizar Hotel'
              : 'Crear Hotel'}
        </Button>
      </form>
    </Form>
  );
}

export default HotelsForm;
