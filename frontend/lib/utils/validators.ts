// lib/utils/validators.ts
import * as z from 'zod';

// Email validation
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address');

// Password validation
export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(100, 'Password is too long');

// Name validation
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name is too long')
  .regex(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces');

// URL validation
export const urlSchema = z
  .string()
  .url('Invalid URL')
  .optional()
  .or(z.literal(''));

// Phone validation
export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s-]+$/, 'Invalid phone number')
  .optional()
  .or(z.literal(''));

// Number validation
export const numberSchema = z
  .union([z.string(), z.number()])
  .refine((val) => !isNaN(Number(val)), 'Must be a number')
  .transform((val) => Number(val));

// Positive number validation
export const positiveNumberSchema = numberSchema.refine(
  (val) => val > 0,
  'Must be a positive number'
);

// Date validation
export const dateSchema = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), 'Invalid date');

// Future date validation
export const futureDateSchema = dateSchema.refine(
  (val) => new Date(val) > new Date(),
  'Date must be in the future'
);

// File validation
export const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB');

// Image file validation
export const imageSchema = fileSchema.refine(
  (file) => file.type.startsWith('image/'),
  'File must be an image'
);

// Array validation with minimum items
export const arrayMinSchema = <T extends z.ZodTypeAny>(schema: T, min: number) =>
  z.array(schema).min(min, `Must have at least ${min} item${min === 1 ? '' : 's'}`);

// Custom validation for confirm password
export const confirmPasswordSchema = (passwordField: string) =>
  z.object({
    password: z.string(),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Validation schemas for forms
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const workspaceSchema = z.object({
  name: nameSchema,
  description: z.string().max(500, 'Description is too long').optional(),
});

export const projectSchema = z.object({
  name: nameSchema,
  description: z.string().max(1000, 'Description is too long').optional(),
  workspaceId: z.string().min(1, 'Workspace is required'),
});

export const taskSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200, 'Title is too long'),
  description: z.string().max(2000, 'Description is too long').optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  dueDate: dateSchema.optional(),
  assignedTo: z.string().optional(),
  projectId: z.string().min(1, 'Project is required'),
});

export const updateTaskSchema = taskSchema.partial().extend({
  id: z.string().min(1, 'Task ID is required'),
});

// Type inference
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type WorkspaceFormData = z.infer<typeof workspaceSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type TaskFormData = z.infer<typeof taskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;