"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { severities, severityColors } from "@/lib/constants/severity";
import { tags as defaultTags } from "@/utils/constants/tags";
import { zodResolver } from "@hookform/resolvers/zod";
import { SafeMarker, type EmergencyMarker } from "@prisma/client";
import {
  FullscreenControl,
  GeolocateControl,
  Map,
  MapRef,
  Marker,
  NavigationControl,
  Popup,
  ScaleControl,
} from "@vis.gl/react-maplibre";
import {
  Ambulance,
  Brain,
  CheckIcon,
  EllipsisVertical,
  Eye,
  MapPinned,
  PhoneCallIcon,
  Shield,
  Smartphone,
  TriangleAlert,
} from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";
import Image from "next/image";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useForm, useFormContext } from "react-hook-form";
import useSWR, { mutate } from "swr";
import { z } from "zod";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isGenericInAppBrowser } from "@/lib/generic-browser-detector";
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

const safeFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  latitude: z.number(),
  longitude: z.number(),
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
      latitude: marked?.latitude || 0,
      longitude: marked?.longitude || 0,
      landmarks: [],
    },
  });

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (marked) {
      methods.setValue("latitude", marked.latitude);
      methods.setValue("longitude", marked.longitude);
    }
  }, [marked, methods]);

  const onSubmit = (formData: z.infer<typeof emergencyFormSchema>) => {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const res = await fetch("/api/emergency/create-mark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          longitude: marked?.longitude ?? formData.longitude,
          latitude: marked?.latitude ?? formData.latitude,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || "Something went wrong", {
          position: "top-center",
        });
        return;
      }

      const data = await res.json();
      toast.success(data.message as string, {
        position: "top-center",
      });
      mutate("/api/emergency/marks");
      methods.reset();
    });
  };

  return {
    methods,
    isPending,
    onSubmit: methods.handleSubmit(onSubmit),
  };
};

const useSafeForm = (
  marked?: { latitude: number; longitude: number } | null
) => {
  const methods = useForm<z.infer<typeof safeFormSchema>>({
    resolver: zodResolver(safeFormSchema),
    defaultValues: {
      title: "",
      description: "",
      latitude: marked?.latitude || 0,
      longitude: marked?.longitude || 0,
    },
  });

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (marked) {
      methods.setValue("latitude", marked.latitude);
      methods.setValue("longitude", marked.longitude);
    }
  }, [marked, methods]);

  const onSubmit = (formData: z.infer<typeof safeFormSchema>) => {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const res = await fetch("/api/safe/create-mark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          longitude: marked?.longitude ?? formData.longitude,
          latitude: marked?.latitude ?? formData.latitude,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || "Something went wrong", {
          position: "top-center",
        });
        return;
      }

      const data = await res.json();
      toast.success(data.message as string, {
        position: "top-center",
      });
      mutate("/api/safe/marks");
      methods.reset();
    });
  };

  return {
    methods,
    isPending,
    onSubmit: methods.handleSubmit(onSubmit),
  };
};
const EmergencyForm = ({ isPendingSubmit }: { isPendingSubmit: boolean }) => {
  const { control } = useFormContext<z.infer<typeof emergencyFormSchema>>();

  const [newTag, setNewTag] = useState<string>("");
  const [tags, setTags] =
    useState<{ id: string; label: string }[]>(defaultTags);

  return (
    <fieldset className="grid gap-4 border-none p-0">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <Label htmlFor="title">
              Emergency Title <span className="text-red-500">*</span>
            </Label>
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
            <Label>
              Emergency Information <span className="text-red-500">*</span>
            </Label>
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
            <Label>
              Nearby Landmarks <span className="text-red-500">*</span>
            </Label>
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
                  placeholder="Find or Create Landmark..."
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
            <Label>
              Contact Number <span className="text-red-500">*</span>
            </Label>
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
            <Label>
              Severity <span className="text-red-500">*</span>
            </Label>
            <select {...field} required className="border rounded p-2">
              <option value="LOW">Low</option>
              <option value="MODERATE">Moderate</option>
              <option value="CRITICAL">Critical</option>
            </select>

            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit" disabled={isPendingSubmit}>
        {isPendingSubmit ? <Spinner /> : "Submit"}{" "}
      </Button>
    </fieldset>
  );
};

const SafeForm = ({ isPendingSubmit }: { isPendingSubmit: boolean }) => {
  const { control } = useFormContext<z.infer<typeof safeFormSchema>>();

  return (
    <fieldset className="grid gap-4 border-none p-0">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <Label>
              Title <span className="text-red-500">*</span>
            </Label>
            <Input {...field} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <Label>
              Information <span className="text-red-500">*</span>
            </Label>
            <Textarea {...field} placeholder="Enter your Information.." />
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" disabled={isPendingSubmit}>
        {isPendingSubmit ? <Spinner /> : "Submit"}{" "}
      </Button>
    </fieldset>
  );
};

const EmergencyMap = ({
  setMarked,
  setSelected,
  selected,
}: {
  setMarked: Dispatch<
    SetStateAction<{
      latitude: number;
      longitude: number;
    } | null>
  >;
  selected: EmergencyMarker | null;
  setSelected: Dispatch<SetStateAction<EmergencyMarker | null>>;
}) => {
  const emergencyMapRef = useRef<MapRef>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { data, isLoading, error } = useSWR<EmergencyMarker[] | null>(
    "/api/emergency/marks",
    fetcher
  );

  if (error) {
    return (
      <div className="my-0 md:my-28 mx-auto max-w-7xl p-4 md:p-0">
        <Alert className="my-5 border-red-600 bg-red-500/10">
          <AlertTitle className="text-xl text-red-500">
            Something went wrong!
          </AlertTitle>
          <AlertDescription className="text-red-400">
            Try to refresh the page
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div
      id="map"
      className="h-[500px] max-w-7xl  relative mx-auto shadow-md rounded-xl overflow-hidden"
    >
      <Map
        ref={emergencyMapRef}
        initialViewState={initialViewState}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://tiles.openfreemap.org/styles/positron"
        onLoad={(onLoad) => setMapLoaded(onLoad.target.loaded())}
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

        {!isLoading &&
          (Array.isArray(data) ? data : []).map((emergency) => (
            <Marker
              key={emergency.id}
              longitude={emergency.longitude}
              latitude={emergency.latitude}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelected(emergency);
              }}
              className="group cursor-pointer"
            >
              <Image
                src={`/pins/pin-${severities[emergency.severity]}.svg`}
                height={30}
                width={30}
                alt={`Marker: ${emergency.title}`}
                className={`group-hover:scale-130 transition-transform duration-300 ${
                  selected ? "scale-150" : "scale-none"
                }`}
              />
            </Marker>
          ))}

        {selected && (
          <Popup
            longitude={selected.longitude}
            latitude={selected.latitude}
            closeButton={true}
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
                  (selected.landmarks as string[]).map((landmark, index) => (
                    <Badge key={index}>{landmark}</Badge>
                  ))}
              </div>
              <br />
              <div className="flex flex-col gap items-start gap-2">
                <div className={`rounded-2xl inline-block space-x-1 bg-muted `}>
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
            <Image src="/pins/pin-low.svg" width={20} height={20} alt="Low" />
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

      {(isLoading || !mapLoaded) && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white rounded-xl">
          <Spinner className="mx-auto mb-2 size-10" />
          <p>Loading map data...</p>
        </div>
      )}
    </div>
  );
};

const SafeMap = ({
  setMarked,
  setSelected,
  selected,
}: {
  setMarked: Dispatch<
    SetStateAction<{
      latitude: number;
      longitude: number;
    } | null>
  >;
  selected: SafeMarker | null;
  setSelected: Dispatch<SetStateAction<SafeMarker | null>>;
}) => {
  const safeMapRef = useRef<MapRef>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const { data, isLoading, error } = useSWR<SafeMarker[] | null>(
    "/api/safe/marks",
    fetcher
  );

  if (error) {
    return (
      <div className="my-0 md:my-28 mx-auto max-w-7xl p-4 md:p-0">
        <Alert className="my-5 border-red-600 bg-red-500/10">
          <AlertTitle className="text-xl text-red-500">
            Something went wrong!
          </AlertTitle>
          <AlertDescription className="text-red-400">
            Try to refresh the page
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div
      id="map"
      className="h-[500px] max-w-7xl  relative mx-auto shadow-md rounded-xl overflow-hidden"
    >
      <Map
        ref={safeMapRef}
        initialViewState={initialViewState}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://tiles.openfreemap.org/styles/positron"
        onLoad={(onLoad) => setMapLoaded(onLoad.target.loaded())}
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

        {!isLoading &&
          (Array.isArray(data) ? data : []).map((safe) => (
            <Marker
              key={safe.id}
              longitude={safe.longitude}
              latitude={safe.latitude}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelected(safe);
              }}
              className="group cursor-pointer"
            >
              <Image
                src={`/pins/pin-safe.png`}
                height={100}
                width={100}
                alt={`Marker: ${safe.title}`}
                className={`group-hover:scale-130 size-10 transition-transform duration-300 ${
                  selected ? "scale-150" : "scale-none"
                }`}
              />
            </Marker>
          ))}

        {selected && (
          <Popup
            longitude={selected.longitude}
            latitude={selected.latitude}
            closeButton={true}
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
            </div>
          </Popup>
        )}
      </Map>

      {(isLoading || !mapLoaded) && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white rounded-xl">
          <Spinner className="mx-auto mb-2 size-10" />
          <p>Loading map data...</p>
        </div>
      )}
    </div>
  );
};

const MapPage = () => {
  const [emergencySelected, setEmergencySelected] =
    useState<EmergencyMarker | null>(null);
  const [safeSelected, setSafeSelected] = useState<SafeMarker | null>(null);

  const [marked, setMarked] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const { methods, onSubmit, isPending } = useEmergencyForm(marked);

  const {
    methods: methodsSafeMark,
    onSubmit: onSubmitSafeMarked,
    isPending: isPendingSafeMark,
  } = useSafeForm(marked);

  if (isGenericInAppBrowser()) {
    return (
      <Dialog open={true} modal>
        <DialogContent className="max-w-5/6" showCloseButton={false}>
          <span className=" border p-4 mx-auto rounded-full">
            {" "}
            <Smartphone className="size-16 text-muted" />
          </span>
          <DialogTitle className="text-2xl text-center font-bold text-red-600">
            Internal Browser Detected!
          </DialogTitle>
          <div className="space-y-4">
            <Alert className="border-red-200 bg-red-50">
              <TriangleAlert className="h-5 w-5 text-red-600!" />
              <AlertDescription className="text-red-700">
                For the best experience and location features, please open this
                app in your device&apos;s default browser (Chrome, Safari,
                etc.).
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <p className="text-sm text-primary">
                <strong>How to open in external browser:</strong>
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>
                  Tap the menu button
                  <span className="inline-block shadow-sm mx-2 rounded-full p-1 border">
                    <EllipsisVertical className="size-4" />
                  </span>
                  in your current browser
                </li>
                <li>
                  Select &quot;Open in Browser&quot; or &quot;Open in
                  Chrome&quot;
                </li>
                <li>
                  Alternatively, copy the URL and paste it in your preferred
                  browser
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="my-0 md:my-28 mx-auto max-w-7xl p-4 md:p-0">
      <Alert className="my-5 border-yellow-500 bg-yellow-500/5">
        <TriangleAlert className="h-10 w-10 text-yellow-500!" />
        <AlertTitle className="text-yellow-600">Reminder</AlertTitle>
        <AlertDescription className="leading-relaxed">
          Please be mindful of the information you submit. You cannot alter or
          changed the information once it is posted. This is a community app —
          once submitted, your data may remain visible for up to 7 days.
        </AlertDescription>
      </Alert>
      <Alert className="my-5 border-green-500 bg-green-500/5 md:hidden">
        <Brain className="h-10 w-10 text-green-500!" />
        <AlertTitle className="text-green-600">Instructions</AlertTitle>
        <AlertDescription className="leading-relaxed">
          Tap the area of the map. A form will appear where you can fill
        </AlertDescription>
      </Alert>
      <Tabs defaultValue="emergency" className="relative ">
        <TabsList className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 shadow-lg!">
          <TabsTrigger value="emergency">
            <Ambulance />
            Emergency
          </TabsTrigger>
          <TabsTrigger value="safe">
            <Shield /> Safe
          </TabsTrigger>
        </TabsList>
        <TabsContent value="emergency">
          <Dialog
            open={!!marked}
            onOpenChange={(open) => {
              if (!open) setMarked(null);
            }}
          >
            <DialogContent className="max-h-4/5 max-w-4/5 md:max-w-lg overflow-y-auto">
              <DialogTitle>Submit a Request</DialogTitle>
              <Form {...methods}>
                <Alert className="my-2 bg-muted">
                  <Eye className="text-muted" />
                  <AlertDescription>
                    Please fill in all the fields below with accurate
                    information about the emergency. Include the title, detailed
                    description, nearby landmarks, your contact number, and the
                    severity of the situation. Providing complete and clear
                    details helps responders reach you faster and provide
                    assistance efficiently.
                  </AlertDescription>
                </Alert>
                <form onSubmit={onSubmit} noValidate>
                  <EmergencyForm isPendingSubmit={isPending} />
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <EmergencyMap
            setMarked={setMarked}
            setSelected={setEmergencySelected}
            selected={emergencySelected}
          />
        </TabsContent>
        <TabsContent value="safe">
          <Dialog
            open={!!marked}
            onOpenChange={(open) => {
              if (!open) setMarked(null);
            }}
          >
            <DialogContent className="max-h-4/5 max-w-4/5 md:max-w-lg overflow-y-auto">
              <DialogTitle>Mark as safe</DialogTitle>
              <Form {...methodsSafeMark}>
                <Alert className="my-2 bg-muted">
                  <Eye className="text-muted" />
                  <AlertDescription>
                    Tell the world that you are safe.
                  </AlertDescription>
                </Alert>
                <form onSubmit={onSubmitSafeMarked} noValidate>
                  <SafeForm isPendingSubmit={isPendingSafeMark} />
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <SafeMap
            setMarked={setMarked}
            setSelected={setSafeSelected}
            selected={safeSelected}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MapPage;
