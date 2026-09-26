import { z } from "zod";
import { baseDestinationSchema } from "../../../schemas/base-destination.schema";

// ============================================================================
// Destination Details
// ============================================================================

export const destinationCostSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, "Die Bezeichnung ist ein Pflichtfeld"),

  value: z
    .string()
    .trim()
    .min(1, "Der Wert ist ein Pflichtfeld"),
});

export const destinationCoordinatesSchema = z.object({
  latitude: z
    .number()
    .min(-90, "Der Breitengrad muss mindestens -90 betragen")
    .max(90, "Der Breitengrad darf höchstens 90 betragen"),

  longitude: z
    .number()
    .min(-180, "Der Längengrad muss mindestens -180 betragen")
    .max(180, "Der Längengrad darf höchstens 180 betragen"),
});

export const destinationHighlightSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Der Titel ist ein Pflichtfeld"),

  description: z
    .string()
    .trim()
    .min(1, "Die Beschreibung ist ein Pflichtfeld"),

  imageUrl: z.url("Bitte eine gültige Bild-URL eingeben"),
});

export const destinationDetailsSchema = z.object({
  flightTime: z
    .string()
    .trim()
    .min(1, "Die Flugzeit ist ein Pflichtfeld"),

  language: z
    .string()
    .trim()
    .min(1, "Die Sprache ist ein Pflichtfeld"),

  monthlyRatings: z
    .array(
      z
        .number()
        .int()
        .min(1)
        .max(5),
    )
    .length(12, "Für jeden Monat muss eine Bewertung vorhanden sein"),

  priceDescription: z
    .string()
    .trim()
    .min(1, "Die Preisbeschreibung ist ein Pflichtfeld"),

  costs: z
    .array(destinationCostSchema)
    .min(1, "Mindestens eine Kostenposition ist erforderlich"),

  coordinates: destinationCoordinatesSchema,

  highlights: z
    .array(destinationHighlightSchema)
    .min(1, "Mindestens ein Höhepunkt ist erforderlich"),

  similarDestinationIds: z
    .array(z.number().int().positive())
    .max(3, "Es dürfen höchstens drei ähnliche Reiseziele ausgewählt werden"),
});

// ============================================================================
// Destination
// ============================================================================

export const destinationSchema = baseDestinationSchema.extend({
  id: z.number().int().positive(),
  details: destinationDetailsSchema,
});

export const destinationsSchema = z.array(destinationSchema);

export const destinationDataSchema = z.object({
  destinations: destinationsSchema,
});

// ============================================================================
// Types
// ============================================================================

export type DestinationCost = z.infer<typeof destinationCostSchema>;
export type DestinationCoordinates = z.infer<
  typeof destinationCoordinatesSchema
>;
export type DestinationHighlight = z.infer<
  typeof destinationHighlightSchema
>;
export type DestinationDetails = z.infer<typeof destinationDetailsSchema>;
export type Destination = z.infer<typeof destinationSchema>;
export type DestinationData = z.infer<typeof destinationDataSchema>;