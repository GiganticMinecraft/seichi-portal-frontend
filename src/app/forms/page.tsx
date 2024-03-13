'use client';

import { getForms } from '@/features/form/api/form';
import FormList from '@/features/form/components/FormList';
import { MinimumForm } from '@/features/form/types/formSchema';
import { useEffect, useState } from 'react';

export default function Home() {
  const [forms, setForms] = useState<MinimumForm[]>([]);

  const fetchForms = async () => {
    setForms(await getForms());
  };

  useEffect(() => {
    fetchForms();
  }, []);

  return <FormList forms={forms} />;
}
