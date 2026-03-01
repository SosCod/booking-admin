'use client';

import * as React from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/admin/ui/select';
import { createRoom, updateRoom } from '@/src/services/rooms.api';
import { getAllHotels } from '@/src/services/hotels.api';
import { UploadButton } from '@/src/utils/uploadthing';
import { Badge } from '@/src/components/admin/ui/badge';
import {
  Wifi,
  Tv,
  Wind,
  Beer,
  Coffee,
  Lock,
  Waves,
  Sun,
  Utensils,
  Car,
  Dumbbell,
  Check,
} from 'lucide-react';

const AVAILABLE_AMENITIES = [
  { id: 'WiFi', icon: Wifi },
  { id: 'TV', icon: Tv },
  { id: 'Aire Acondicionado', icon: Wind },
  { id: 'Minibar', icon: Beer },
  { id: 'Cafetera', icon: Coffee },
  { id: 'Caja Fuerte', icon: Lock },
  { id: 'Piscina', icon: Waves },
  { id: 'Balcón', icon: Sun },
  { id: 'Room Service', icon: Utensils },
  { id: 'Estacionamiento', icon: Car },
  { id: 'Gimnasio', icon: Dumbbell },
];

type RoomFormData = {
  hotelId: string;
  name: string;
  description: string;
  type: 'STANDARD' | 'DELUXE' | 'SUITE' | 'PRESIDENTIAL';
  price: string;
  maxGuests: string;
  amenities: string[];
};

export function RoomsForm({
  onSuccess,
  initialData,
}: {
  onSuccess?: () => void;
  initialData?: any;
}) {
  const form = useForm<RoomFormData>({
    defaultValues: initialData
      ? {
          hotelId: String(initialData.hotelId),
          name: initialData.name,
          description: initialData.description,
          type: initialData.type,
          price: String(initialData.price),
          maxGuests: String(initialData.maxGuests),
          amenities: initialData.amenities || [],
        }
      : {
          type: 'STANDARD',
          maxGuests: '2',
          amenities: [],
        },
  });
  const [hotels, setHotels] = React.useState<any[]>([]);
  const [uploadedImages, setUploadedImages] = React.useState<string[]>(
    initialData?.images || [],
  );

  React.useEffect(() => {
    getAllHotels().then(setHotels).catch(console.error);
  }, []);

  const onSubmit: SubmitHandler<RoomFormData> = async (data) => {
    try {
      if (uploadedImages.length === 0) {
        alert('Sube al menos una imagen');
        return;
      }

      const roomData = {
        ...data,
        hotelId: parseInt(data.hotelId),
        price: parseFloat(data.price),
        maxGuests: parseInt(data.maxGuests),
        images: uploadedImages,
        amenities: data.amenities,
      };

      if (initialData) {
        await updateRoom(initialData.id, roomData);
        alert('Habitación actualizada con éxito');
      } else {
        await createRoom(roomData);
        alert('Habitación creada con éxito');
        form.reset();
        setUploadedImages([]);
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      alert(
        initialData
          ? 'Error al actualizar habitación'
          : 'Error al crear habitación',
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="hotelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hotel</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un hotel" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {hotels.map((hotel) => (
                    <SelectItem key={hotel.id} value={String(hotel.id)}>
                      {hotel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Habitación</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej: Suite Nupcial"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="STANDARD">Standard</SelectItem>
                    <SelectItem value="DELUXE">Deluxe</SelectItem>
                    <SelectItem value="SUITE">Suite</SelectItem>
                    <SelectItem value="PRESIDENTIAL">Presidential</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio por noche</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="100"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe la habitación..."
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maxGuests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacidad Máxima (Personas)</FormLabel>
              <FormControl>
                <Input type="number" {...field} value={field.value ?? ''} />
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
              <FormLabel>Amenidades</FormLabel>
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
                            ? 'bg-pink-500 hover:bg-pink-600 text-white'
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

        <div className="space-y-2">
          <FormLabel>Imágenes</FormLabel>
          <div className="flex flex-wrap gap-2 mb-2">
            {uploadedImages.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="Room"
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
          <UploadButton
            endpoint="hotelImageUploader"
            onClientUploadComplete={(res) => {
              if (res) {
                setUploadedImages((prev) => [
                  ...prev,
                  ...res.map((f) => f.url),
                ]);
                alert('Imágenes subidas');
              }
            }}
            onUploadError={(error: Error) => alert(`Error: ${error.message}`)}
          />
        </div>

        <Button type="submit" className="w-full">
          {initialData ? 'Guardar Cambios' : 'Crear Habitación'}
        </Button>
      </form>
    </Form>
  );
}
