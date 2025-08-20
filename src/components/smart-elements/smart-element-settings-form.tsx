import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SmartElementSettingsFormProps {
  schema: any;
  values: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  disabled?: boolean;
}

export function SmartElementSettingsForm({
  schema,
  values,
  onSubmit,
  disabled = false
}: SmartElementSettingsFormProps) {
  const [formValues, setFormValues] = React.useState(values);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  if (!schema) {
    return <div className="text-center py-8 text-sm text-muted-foreground">
      لا توجد إعدادات متاحة
    </div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>المحتوى</Label>
        <Input
          value={formValues.content || ''}
          onChange={(e) => setFormValues(prev => ({ ...prev, content: e.target.value }))}
          disabled={disabled}
        />
      </div>
      <Button type="submit" className="w-full" disabled={disabled}>
        تطبيق
      </Button>
    </form>
  );
}