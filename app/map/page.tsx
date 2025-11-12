"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import {
  Map,
  MapRef,
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  useMap,
} from "@vis.gl/react-maplibre";
import {
  CheckIcon,
  MapPin,
  MapPinned,
  Phone,
  PhoneCallIcon,
  PlusIcon,
  TriangleAlert,
} from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import useSWR, { mutate } from "swr";
import { Severity, type EmergencyMarker } from "@prisma/client";
import { severities, severityColors } from "@/lib/constants/severity";
import { Badge } from "@/components/ui/badge";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import {
  Tags,
  TagsContent,
  TagsEmpty,
  TagsGroup,
  TagsInput,
  TagsItem,
  TagsList,
  TagsTrigger,
  TagsValue,
} from "@/components/ui/shadcn-io/tags";
import { toast } from "sonner";

const initialViewState = {
  latitude: 12.8797,
  longitude: 121.774,
  zoom: 5,
  bearing: 0,
  pitch: 0,
};

const emergencyFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  contact_number: z
    .string()
    .min(7, "Contact number is too short")
    .max(15, "Contact number is too long")
    .regex(
      /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
      "Invalid phone number"
    ),
  severity: z
    .enum(["LOW", "MODERATE", "CRITICAL"])
    .transform(
      (val) => val.trim().toUpperCase() as "LOW" | "MODERATE" | "CRITICAL"
    ),
  latitude: z.number(),
  longitude: z.number(),
  landmarks: z.array(z.string()).optional(),
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const useEmergencyForm = (
  marked?: { latitude: number; longitude: number } | null
) => {
  const methods = useForm<z.infer<typeof emergencyFormSchema>>({
    resolver: zodResolver(emergencyFormSchema),
    defaultValues: {
      title: "",
      description: "",
      contact_number: "",
      severity: "LOW",
      latitude: 0,
      longitude: 0,
      landmarks: [],
    },
  });
  const [isPending, startEmergencyRequestTransition] = useTransition();

  const onSubmit = (formData: z.infer<typeof emergencyFormSchema>) => {
    startEmergencyRequestTransition(async () => {
      try {
        const res = await fetch("/api/emergency/create-mark", {
          method: "POST",
          body: JSON.stringify({
            ...formData,
            longitude: marked?.longitude,
            latitude: marked?.latitude,
          }),
        });
        if (!res.status) {
          const err = await res.json();
          toast.error(err);
          return;
        }

        const data = await res.json();
        toast.success(data.message as string);
        mutate("/api/emergency/marks");
        methods.reset();
      } catch (error) {
        console.error("Request failed:", error);
      }
    });
  };

  return {
    methods,
    isPending,
    onSubmit: methods.handleSubmit(onSubmit),
  };
};

const EmergencyForm = () => {
  const { control } = useFormContext<z.infer<typeof emergencyFormSchema>>();
  const { isPending } = useEmergencyForm();
  const defaultTags = [
    { id: "near school ", label: "Near School" },
    { id: "2 blocks away", label: "Two blocks away" },
    { id: "at the church", label: "At the church" },
  ];
  const [selected, setSelected] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [tags, setTags] =
    useState<{ id: string; label: string }[]>(defaultTags);
  const handleRemove = (value: string) => {
    if (!selected.includes(value)) {
      return;
    }
    console.log(`removed: ${value}`);
    setSelected((prev) => prev.filter((v) => v !== value));
  };
  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      handleRemove(value);
      return;
    }
    console.log(`selected: ${value}`);
    setSelected((prev) => [...prev, value]);
  };
  return (
    <fieldset className="grid gap-4 border-none p-0">
      <Label htmlFor="title">Emergency Title</Label>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <Label>Title</Label>
            <Input {...field} placeholder="Enter emergency title" />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <Label>Emergency Information</Label>
            <Textarea
              {...field}
              placeholder="Enter your Emergency Information.."
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="landmarks"
        render={({ field }) => (
          <FormItem>
            <Label>Nearby Landmarks</Label>
            <Tags>
              <TagsTrigger>
                {(field.value ?? []).map((tag: string) => (
                  <TagsValue
                    key={tag}
                    onRemove={() =>
                      field.onChange(
                        (field.value ?? []).filter((t: string) => t !== tag)
                      )
                    }
                  >
                    {tags.find((t) => t.id === tag)?.label ?? tag}
                  </TagsValue>
                ))}
              </TagsTrigger>

              <TagsContent>
                <TagsInput
                  value={newTag}
                  onValueChange={setNewTag}
                  placeholder="Search landmark..."
                />
                <TagsList>
                  <TagsEmpty>
                    {newTag && (
                      <button
                        type="button"
                        onClick={() => {
                          const createdTag = { id: newTag, label: newTag };
                          setTags((prev) => [...prev, createdTag]);
                          field.onChange([...(field.value ?? []), newTag]);
                          setNewTag("");
                        }}
                      >
                        <MapPinned
                          className="size-10 text-gray-300  mx-auto rounded-full border-2"
                          strokeWidth={1}
                        />{" "}
                        <span className="text-muted-foreground">
                          Write your own landmark
                        </span>
                        <p className="text-xl font-semibold">{newTag}</p>
                      </button>
                    )}
                  </TagsEmpty>

                  <TagsGroup>
                    {tags.map((tagItem) => (
                      <TagsItem
                        key={tagItem.id}
                        value={tagItem.id}
                        onSelect={() => {
                          const newValue = (field.value ?? []).includes(
                            tagItem.id
                          )
                            ? (field.value ?? []).filter(
                                (v: string) => v !== tagItem.id
                              )
                            : [...(field.value ?? []), tagItem.id];
                          field.onChange(newValue);
                        }}
                      >
                        {tagItem.label}
                        {(field.value ?? []).includes(tagItem.id) && (
                          <CheckIcon size={14} />
                        )}
                      </TagsItem>
                    ))}
                  </TagsGroup>
                </TagsList>
              </TagsContent>
            </Tags>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="contact_number"
        render={({ field }) => (
          <FormItem>
            <Label>Contact Number</Label>
            <Input
              type="tel"
              {...field}
              placeholder="Enter your phone number"
              required
            />

            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="severity"
        render={({ field }) => (
          <FormItem>
            <Label>Severity</Label>
            <select {...field} required className="border rounded p-2">
              <option value="LOW">Low</option>
              <option value="MODERATE">Moderate</option>
              <option value="CRITICAL">Critical</option>
            </select>

            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit">{isPending && <Spinner />} Send Request</Button>
    </fieldset>
  );
};

const MapPage = () => {
  const mapRef = useRef<MapRef>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selected, setSelected] = useState<EmergencyMarker | null>(null);
  const [marked, setMarked] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const { methods, onSubmit } = useEmergencyForm(marked);

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const { data, isLoading, error } = useSWR<EmergencyMarker[]>(
    "/api/emergency/marks",
    fetcher
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, []);

  useEffect(() => {
    if (mapLoaded && location && mapRef.current) {
      mapRef.current.flyTo({
        center: [location.longitude, location.latitude],
        zoom: 13,
        speed: 1.2,
        curve: 1.5,
        essential: true,
      });
    }
  }, [mapLoaded, location]);

  if (error)
    <Alert className="my-5 border-red-600 bg-red-500/10">
      <AlertTitle className="text-xl text-red-500">
        Something went wrong!
      </AlertTitle>
      <AlertDescription className="text-red-400">
        Try to refresh the page
      </AlertDescription>
    </Alert>;

  return (
    <div className="my-0 md:my-28 mx-auto max-w-7xl p-4 md:p-0">
      <Alert className="my-5 border-yellow-500 bg-yellow-500/5">
        <TriangleAlert className="h-10 w-10 text-yellow-500!" />
        <AlertTitle>Reminder</AlertTitle>
        <AlertDescription className="leading-relaxed">
          Please be mindful of the information you submit. You cannot alter or
          changed the information once it is posted. This is a community app —
          once submitted, your data may remain visible for up to 7 days.
        </AlertDescription>
      </Alert>

      <Dialog
        open={!!marked}
        onOpenChange={(open) => {
          if (!open) setMarked(null);
        }}
      >
        <DialogContent className="max-h-4/5 max-w-4/5 md:max-w-lg overflow-y-auto">
          <Form {...methods}>
            <div className="p-2 text-sm">
              <h1 className="font-bold text-xl">Send Request</h1>
              <Alert className="my-2">
                <AlertDescription>
                  Please fill in all the fields below with accurate information
                  about the emergency. Include the title, detailed description,
                  nearby landmarks, your contact number, and the severity of the
                  situation. Providing complete and clear details helps
                  responders reach you faster and provide assistance
                  efficiently.
                </AlertDescription>
              </Alert>
              <form onSubmit={onSubmit} noValidate>
                <EmergencyForm />
              </form>
            </div>
          </Form>
        </DialogContent>
        <div
          id="map"
          className="h-[500px] max-w-7xl  relative mx-auto shadow-md rounded-xl overflow-hidden"
        >
          <Map
            ref={mapRef}
            initialViewState={initialViewState}
            style={{ width: "100%", height: "100%" }}
            mapStyle="https://tiles.openfreemap.org/styles/positron"
            onLoad={() => setMapLoaded(true)}
            onClick={(mapData) =>
              setMarked({
                latitude: mapData.lngLat.lat,
                longitude: mapData.lngLat.lng,
              })
            }
            logoPosition="bottom-right"
          >
            <GeolocateControl position="top-left" />
            <FullscreenControl position="top-left" />
            <NavigationControl position="top-left" />
            <ScaleControl />

            {data &&
              !isLoading &&
              data.map((emergency) => (
                <Marker
                  key={emergency.id}
                  longitude={emergency.longitude}
                  latitude={emergency.latitude}
                  anchor="bottom"
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    setSelected(emergency);
                  }}
                >
                  <Image
                    src={`/pins/pin-${severities[emergency.severity]}.svg`}
                    height={30}
                    width={30}
                    alt={`Marker: ${emergency.title}`}
                  />
                </Marker>
              ))}
            {selected && (
              <Popup
                longitude={selected.longitude}
                latitude={selected.latitude}
                closeButton={false}
                closeOnClick
                onClose={() => setSelected(null)}
              >
                <div className="p-2 text-sm">
                  <h3 className="font-bold text-2xl">{selected.title}</h3>
                  <p className="text-muted-foreground text-xs">
                    <strong>Date Posted:</strong>{" "}
                    {new Date(selected.createdAt).toLocaleString()}
                  </p>
                  <div className="p-2 border border-gray-200 rounded-md my-1 bg-muted">
                    <h4 className="font-medium!">Emergency Information</h4>
                    <p>{selected.description}</p>
                  </div>
                  <br />
                  <div className="space-x-1.5 space-y-1.5">
                    <h4>Landmarks</h4>
                    {selected.landmarks &&
                      (selected.landmarks as string[]).map(
                        (landmark, index) => (
                          <Badge key={index}>{landmark}</Badge>
                        )
                      )}
                  </div>
                  <br />
                  <div className="flex flex-col gap items-start gap-2">
                    <div
                      className={`rounded-2xl inline-block space-x-1 bg-muted `}
                    >
                      <Badge>Severity</Badge>
                      <span
                        className={`p-2 ${
                          severityColors[selected.severity]
                        } font-medium tracking-wide`}
                      >
                        {severities[selected.severity].toUpperCase()}
                      </span>
                    </div>
                    <div className="rounded-2xl  inline-block  space-x-2">
                      <Badge className="bg-green-600 mr-2">
                        {" "}
                        <PhoneCallIcon />{" "}
                      </Badge>
                      {selected.contact_number}
                    </div>
                  </div>
                </div>
              </Popup>
            )}
          </Map>
          <div className="absolute bottom-10 left-3 rounded-xl border-2 p-4">
            <h3 className="font-semibold mb-2 text-gray-700">Legend</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Image
                  src="/pins/pin-low.svg"
                  width={20}
                  height={20}
                  alt="Low"
                />
                <span className="text-gray-600">Low Severity</span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/pins/pin-moderate.svg"
                  width={20}
                  height={20}
                  alt="Moderate"
                />
                <span className="text-gray-600">Moderate Severity</span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/pins/pin-critical.svg"
                  width={20}
                  height={20}
                  alt="Critical"
                />
                <span className="text-gray-600">Critical Severity</span>
              </div>
            </div>
          </div>

          {(!location || isLoading) && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white rounded-xl">
              <Spinner className="mx-auto mb-2 size-10" />
              <p>Loading map data...</p>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default MapPage;
