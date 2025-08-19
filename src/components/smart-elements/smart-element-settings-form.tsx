import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { BaseBadge as Badge } from '@/components/ui/BaseBadge';
import { Save, RotateCcw } from 'lucide-react';
import { useDirection } from '../../contexts/direction-context';

interface SmartElementSettingsFormProps {
  schema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
  values: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  disabled?: boolean;
}

export function SmartElementSettingsForm({ 
  schema, 
  values = {}, 
  onSubmit, 
  disabled = false 
}: SmartElementSettingsFormProps) {
  const { direction } = useDirection();
  const [formValues, setFormValues] = useState<Record<string, any>>(values);
  const [hasChanges, setHasChanges] = useState(false);

  // Update form values when prop values change
  useEffect(() => {
    setFormValues(values);
    setHasChanges(false);
  }, [values]);

  // Check if form has changes
  useEffect(() => {
    const changed = Object.keys(formValues).some(key => 
      formValues[key] !== values[key]
    );
    setHasChanges(changed);
  }, [formValues, values]);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled) {
      onSubmit(formValues);
      setHasChanges(false);
    }
  };

  const handleReset = () => {
    setFormValues(values);
    setHasChanges(false);
  };

  const renderField = (fieldName: string, fieldSchema: any) => {
    const value = formValues[fieldName] ?? fieldSchema.default ?? '';
    const isRequired = schema.required?.includes(fieldName);
    
    const fieldLabel = fieldSchema.title || fieldName;
    const fieldDescription = fieldSchema.description;

    switch (fieldSchema.type) {
      case 'string':
        if (fieldSchema.enum) {
          // Select dropdown for enums
          return (
            <div key={fieldName} className="space-y-2">
              <Label htmlFor={fieldName} className="text-sm font-medium">
                {fieldLabel}
                {isRequired && <span className="text-destructive ms-1">*</span>}
              </Label>
              <Select
                value={value}
                onValueChange={(newValue) => handleFieldChange(fieldName, newValue)}
                disabled={disabled}
              >
                <SelectTrigger id={fieldName}>
                  <SelectValue placeholder={`اختر ${fieldLabel}`} />
                </SelectTrigger>
                <SelectContent>
                  {fieldSchema.enum.map((option: string, index: number) => (
                    <SelectItem key={option} value={option}>
                      {fieldSchema.enumNames?.[index] || option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldDescription && (
                <p className="text-xs text-muted-foreground">{fieldDescription}</p>
              )}
            </div>
          );
        } else if (fieldSchema.format === 'textarea') {
          // Textarea for multiline text
          return (
            <div key={fieldName} className="space-y-2">
              <Label htmlFor={fieldName} className="text-sm font-medium">
                {fieldLabel}
                {isRequired && <span className="text-destructive ms-1">*</span>}
              </Label>
              <Textarea
                id={fieldName}
                value={value}
                onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                disabled={disabled}
                rows={3}
                placeholder={fieldSchema.placeholder || `أدخل ${fieldLabel}`}
              />
              {fieldDescription && (
                <p className="text-xs text-muted-foreground">{fieldDescription}</p>
              )}
            </div>
          );
        } else {
          // Regular text input
          return (
            <div key={fieldName} className="space-y-2">
              <Label htmlFor={fieldName} className="text-sm font-medium">
                {fieldLabel}
                {isRequired && <span className="text-destructive ms-1">*</span>}
              </Label>
              <Input
                id={fieldName}
                type="text"
                value={value}
                onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                disabled={disabled}
                placeholder={fieldSchema.placeholder || `أدخل ${fieldLabel}`}
              />
              {fieldDescription && (
                <p className="text-xs text-muted-foreground">{fieldDescription}</p>
              )}
            </div>
          );
        }

      case 'number':
        return (
          <div key={fieldName} className="space-y-2">
            <Label htmlFor={fieldName} className="text-sm font-medium">
              {fieldLabel}
              {isRequired && <span className="text-destructive ms-1">*</span>}
            </Label>
            <Input
              id={fieldName}
              type="number"
              value={value}
              onChange={(e) => handleFieldChange(fieldName, parseFloat(e.target.value) || 0)}
              disabled={disabled}
              min={fieldSchema.minimum}
              max={fieldSchema.maximum}
              step={fieldSchema.multipleOf || 1}
              placeholder={fieldSchema.placeholder || `أدخل ${fieldLabel}`}
            />
            {(fieldSchema.minimum !== undefined || fieldSchema.maximum !== undefined) && (
              <div className="flex gap-2 text-xs text-muted-foreground">
                {fieldSchema.minimum !== undefined && (
                  <Badge variant="outline">الحد الأدنى: {fieldSchema.minimum}</Badge>
                )}
                {fieldSchema.maximum !== undefined && (
                  <Badge variant="outline">الحد الأقصى: {fieldSchema.maximum}</Badge>
                )}
              </div>
            )}
            {fieldDescription && (
              <p className="text-xs text-muted-foreground">{fieldDescription}</p>
            )}
          </div>
        );

      case 'boolean':
        return (
          <div key={fieldName} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={fieldName} className="text-sm font-medium">
                {fieldLabel}
                {isRequired && <span className="text-destructive ms-1">*</span>}
              </Label>
              <Switch
                id={fieldName}
                checked={value}
                onCheckedChange={(checked) => handleFieldChange(fieldName, checked)}
                disabled={disabled}
              />
            </div>
            {fieldDescription && (
              <p className="text-xs text-muted-foreground">{fieldDescription}</p>
            )}
          </div>
        );

      default:
        // Fallback to text input
        return (
          <div key={fieldName} className="space-y-2">
            <Label htmlFor={fieldName} className="text-sm font-medium">
              {fieldLabel} ({fieldSchema.type})
              {isRequired && <span className="text-destructive ms-1">*</span>}
            </Label>
            <Input
              id={fieldName}
              type="text"
              value={String(value)}
              onChange={(e) => handleFieldChange(fieldName, e.target.value)}
              disabled={disabled}
              placeholder={`أدخل ${fieldLabel}`}
            />
            {fieldDescription && (
              <p className="text-xs text-muted-foreground">{fieldDescription}</p>
            )}
          </div>
        );
    }
  };

  if (!schema?.properties) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        <p>لا توجد إعدادات قابلة للتخصيص</p>
      </div>
    );
  }

  const fieldEntries = Object.entries(schema.properties);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fieldEntries.map(([fieldName, fieldSchema]) => 
        renderField(fieldName, fieldSchema)
      )}

      {fieldEntries.length > 0 && (
        <>
          <Separator className="my-4" />
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              size="sm" 
              disabled={disabled || !hasChanges}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              حفظ التغييرات
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              disabled={disabled || !hasChanges}
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              إعادة تعيين
            </Button>
          </div>
          
          {hasChanges && (
            <p className="text-xs text-muted-foreground">
              يوجد تغييرات غير محفوظة
            </p>
          )}
        </>
      )}
    </form>
  );
}