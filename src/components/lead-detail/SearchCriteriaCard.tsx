import { useState, useRef, useCallback } from 'react';
import { ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { CollapsibleCard } from './CollapsibleCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CriteriaField {
  label: string;
  stateKey: string;
  options: string[];
  defaultValue: string;
}

const fields: CriteriaField[] = [
  {
    label: 'Area',
    stateKey: 'area',
    options: ['None', 'Main Street, USA', 'Downtown Dallas', 'Highland Park', 'Uptown'],
    defaultValue: 'none',
  },
  {
    label: 'Home Type',
    stateKey: 'homeType',
    options: ['None', 'Single Family', 'Condo', 'Townhouse'],
    defaultValue: 'none',
  },
  {
    label: 'Min Price',
    stateKey: 'minPrice',
    options: ['None', '$200,000', '$400,000', '$600,000'],
    defaultValue: 'none',
  },
  {
    label: 'Max Price',
    stateKey: 'maxPrice',
    options: ['None', '$500,000', '$800,000', '$1,000,000'],
    defaultValue: 'none',
  },
  {
    label: 'Min SQFT',
    stateKey: 'minSqft',
    options: ['None', '1,000', '1,500', '2,000'],
    defaultValue: 'none',
  },
  {
    label: 'Min Beds',
    stateKey: 'minBeds',
    options: ['None', '2', '3', '4'],
    defaultValue: 'none',
  },
  {
    label: 'Min Baths',
    stateKey: 'minBaths',
    options: ['None', '1', '2', '3'],
    defaultValue: 'none',
  },
];

function toSlug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function SearchCriteriaCard() {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    fields.forEach((f) => {
      init[f.stateKey] = f.defaultValue;
    });
    return init;
  });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback((key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      toast('Search criteria updated');
    }, 400);
  }, []);

  return (
    <CollapsibleCard
      title="Search Criteria"
      footer={
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => toast('Running search on website with current criteria…')}
            className="inline-flex items-center gap-1.5 text-text-4 font-medium text-text-link hover:underline cursor-pointer"
          >
            <span>See Search Results</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      }
    >
      <div className="space-y-spacing-3">
        {fields.map((field) => (
          <div key={field.stateKey} className="flex items-center gap-spacing-2">
            <span className="text-text-4 font-normal text-text-secondary w-[80px] shrink-0">
              {field.label}
            </span>
            <div className="flex-1">
              <Select
                value={values[field.stateKey]}
                onValueChange={(v) => handleChange(field.stateKey, v)}
              >
                <SelectTrigger className="h-8 rounded-1 border-border-default bg-white text-text-4 px-spacing-3 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((opt) => {
                    const slug = toSlug(opt);
                    return (
                      <SelectItem key={slug} value={slug}>
                        {opt}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>
    </CollapsibleCard>
  );
}
