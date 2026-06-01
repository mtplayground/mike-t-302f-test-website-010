import { PUBLIC_FORM_ENDPOINT } from 'astro:env/client';

const normalizedFormEndpoint = PUBLIC_FORM_ENDPOINT?.trim();

export const contactFormConfig = {
  endpoint: normalizedFormEndpoint || undefined,
  hasEndpoint: Boolean(normalizedFormEndpoint),
} as const;
