// src/app/page.tsx (acts as a redirector to default locale)
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/zh'); // Redirect to default locale (Chinese)
}
