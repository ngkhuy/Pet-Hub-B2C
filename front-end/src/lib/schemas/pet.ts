import z from "zod";

export const petTypeSchema = z.enum(["Cat", "Dog", "All"]);
export type PetType = z.infer<typeof petTypeSchema>;

export const petTypeLabels: Record<PetType, string> = {
  Dog: "Chó",
  Cat: "Mèo",
  All: "Tất cả",
};

export const petSchema = z.object({
  id: z.uuidv4(),
  userId: z.uuidv4(),
  name: z.string().min(1, "Tên không được để trống"),
  species: petTypeSchema,
  birth: z.date(),
  breed: z.string().min(1, "Giống không được để trống"),
  note: z.string(),
});
export type Pet = z.infer<typeof petSchema>;
