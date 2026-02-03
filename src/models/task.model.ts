import { z } from 'zod';

export const schemaCreateTask = z.object({
  name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .min(3, 'Mínimo 3 caracteres')
    .max(255, 'Máximo 255 caracteres')
    .regex(
      /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()\-_\s]+$/,
      'Solo se permiten caracteres alfanuméricos'
    ),
});

export type CreateTaskFormValues = z.infer<typeof schemaCreateTask>;