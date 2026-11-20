import { profile } from "@/data/portfolio";
export type ContactDraft = {
  name: string;
  email: string;
  subject: string;
  message: string;
};
export function composeMailto(draft: ContactDraft): string {
  const body = `${draft.message.trim()}\n\n—\n${draft.name.trim()} <${draft.email.trim()}>`;
  return `mailto:${profile.email}?subject=${encodeURIComponent(draft.subject.trim())}&body=${encodeURIComponent(body)}`;
}
