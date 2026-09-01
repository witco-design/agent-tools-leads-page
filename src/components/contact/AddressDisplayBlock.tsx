import { ContactFieldMenu } from './ContactFieldMenu';

interface AddressDisplayBlockProps {
  street: string;
  addressLine2: string;
  cityStateZip: string;
  fullAddress: string;
  /** Tailwind width class for the label (default w-24, matching Snapshot). */
  labelWidthClass?: string;
  /** Extra classes for the outer container (e.g. grid positioning in Snapshot). */
  containerClass?: string;
}

/**
 * Combined multi-line address display shared by the Snapshot and Contact Info.
 * Line 1 (street) carries the chevron action menu; lines 2 and 3 do not.
 * Right-aligned blue value column, lines stacked tightly (gap-0).
 */
export function AddressDisplayBlock({
  street,
  addressLine2,
  cityStateZip,
  fullAddress,
  labelWidthClass = 'w-24',
  containerClass = '',
}: AddressDisplayBlockProps) {
  const hasAddressLine2 = addressLine2.trim() !== '';

  return (
    <div className={`flex items-start gap-spacing-3 ${containerClass}`}>
      <span
        className={`${labelWidthClass} text-sm leading-5 text-text-muted flex-shrink-0`}
      >
        Address
      </span>
      <div className="flex-1 min-w-0 flex flex-col items-end gap-0">
        {/* Line 1: street with chevron menu */}
        <ContactFieldMenu
          field="address"
          value={street}
          fullAddress={fullAddress}
          valueClassName="leading-5"
          ariaLabel="Address"
        />

        {/* Line 2 (optional): Address Line 2 — no chevron */}
        {hasAddressLine2 && (
          <ContactFieldMenu
            field="address"
            value={addressLine2}
            fullAddress={fullAddress}
            showChevron={false}
            valueClassName="leading-5"
            triggerClassName="-ml-1 mr-[20px]"
            ariaLabel="Address"
          />
        )}

        {/* Line 3 (or 2): city/state/zip — no chevron */}
        {cityStateZip && (
          <ContactFieldMenu
            field="address"
            value={cityStateZip}
            fullAddress={fullAddress}
            showChevron={false}
            valueClassName="leading-5"
            triggerClassName="-ml-1 mr-[20px]"
            ariaLabel="Address"
          />
        )}
      </div>
    </div>
  );
}
