import { PUBLIC_FORM_ENDPOINT } from 'astro:env/client';

const normalizedFormEndpoint = PUBLIC_FORM_ENDPOINT?.trim();
const mailtoFallbackAction = `mailto:?subject=${encodeURIComponent('myClawTeam contact form')}`;

export const contactFormConfig = {
  endpoint: normalizedFormEndpoint || undefined,
  action: normalizedFormEndpoint || mailtoFallbackAction,
  hasEndpoint: Boolean(normalizedFormEndpoint),
  encoding: normalizedFormEndpoint ? 'application/x-www-form-urlencoded' : 'text/plain',
} as const;
