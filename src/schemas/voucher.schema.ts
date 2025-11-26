import { z } from "zod";

export const createVoucherSchema = z.object({
  body: z.object({
    code: z
      .string()
      .trim()
      .min(3, "Code must be at least 3 characters")
      .max(32, "Code must be at most 32 characters"),
    discountAmount: z
      .number({
        invalid_type_error: "Discount amount must be a number",
      })
      .positive("Discount amount must be greater than 0"),
    maxUsage: z
      .number({
        invalid_type_error: "Max usage must be a number",
      })
      .int("Max usage must be an integer")
      .positive("Max usage must be greater than 0")
      .nullable()
      .optional(),
    expiredAt: z
      .string()
      .datetime("expiredAt must be a valid ISO datetime string"),
  }),
  params: z.object({
    eventId: z
      .string({
        required_error: "eventId is required",
      })
      .uuid("eventId must be a valid UUID"),
  }),
});

export type CreateVoucherInput = z.infer<typeof createVoucherSchema>["body"];
