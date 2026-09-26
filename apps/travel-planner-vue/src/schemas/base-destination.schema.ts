import { z } from "zod";

// ============================================================================
// Base Destination
// ============================================================================

/**
 * Enthält alle Felder, die sowohl eine Destination als auch ein
 * Wishlist-Eintrag besitzen.
 *
 * IDs und Detaildaten gehören nicht in das Base-Schema:
 * - Destination.id identifiziert das Reiseziel.
 * - WishlistEntry.id identifiziert den Wishlist-Eintrag.
 * - WishlistEntry.destinationId verweist auf das ursprüngliche Reiseziel.
 */
export const baseDestinationSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Der Slug ist ein Pflichtfeld")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Der Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten",
    ),

  title: z
    .string()
    .trim()
    .min(1, "Der Titel ist ein Pflichtfeld"),

  description: z
    .string()
    .trim()
    .min(1, "Die Beschreibung ist ein Pflichtfeld"),

  country: z
    .string()
    .trim()
    .min(1, "Das Land ist ein Pflichtfeld"),

  season: z.enum(
    ["Frühling", "Sommer", "Herbst", "Winter"],
    "Bitte eine gültige Saison auswählen",
  ),

  tags: z
    .array(z.string().trim().min(1))
    .min(1, "Mindestens ein Tag ist erforderlich"),

  price: z
    .string()
    .trim()
    .min(1, "Der Preis ist ein Pflichtfeld"),

  duration: z
    .string()
    .trim()
    .min(1, "Die Dauer ist ein Pflichtfeld"),

  imageUrl: z.url("Bitte eine gültige Bild-URL eingeben"),
});

// ============================================================================
// Types
// ============================================================================

export type BaseDestination = z.infer<typeof baseDestinationSchema>;