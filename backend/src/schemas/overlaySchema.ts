import { z } from 'zod';

// Coordinate schema
export const coordinateSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  elevation: z.number().optional(),
  timestamp: z.string().optional(),
});

// Activity data schema
export const activityDataSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200),
  distance: z.number().min(0),
  duration: z.number().min(0),
  elevation: z.number().min(0),
  pace: z.number().min(0),
  coordinates: z.array(coordinateSchema).min(1),
  startTime: z.string().datetime(),
  type: z.string().min(1),
});

// Overlay style schema
export const overlayStyleSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  backgroundColor: z.string(),
  fontSize: z.number().min(12).max(120),
  position: z.enum(['top', 'center', 'bottom']),
  showMap: z.boolean(),
  showStats: z.boolean(),
});

// Overlay generation request schema
export const overlayRequestSchema = z.object({
  activityData: activityDataSchema,
  // KORRIGIERT: .nullable() hinzugefügt, um `null` als gültigen Wert zu erlauben
  backgroundImage: z.string().url().nullable().optional(),
  overlayStyle: overlayStyleSchema.optional(),
});

// Custom overlay request schema
export const customOverlayRequestSchema = z.object({
  activityData: activityDataSchema,
  // KORRIGIERT: .nullable() hinzugefügt, um `null` als gültigen Wert zu erlauben
  backgroundImage: z.string().url().nullable().optional(),
  customStyle: overlayStyleSchema.partial(),
});

// Template preview request schema
export const templatePreviewRequestSchema = z.object({
  activityData: activityDataSchema,
});

// Export types for use in controllers
export type OverlayRequest = z.infer<typeof overlayRequestSchema>;
export type CustomOverlayRequest = z.infer<typeof customOverlayRequestSchema>;
export type TemplatePreviewRequest = z.infer<typeof templatePreviewRequestSchema>;
export type OverlayStyle = z.infer<typeof overlayStyleSchema>;
export type ActivityData = z.infer<typeof activityDataSchema>;
export type Coordinate = z.infer<typeof coordinateSchema>;