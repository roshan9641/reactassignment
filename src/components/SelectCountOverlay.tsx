import React from 'react';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';

interface SelectCountOverlayProps {
  selectCount: number | null;
  setSelectCount: (value: number | null) => void;
  onSubmit: () => void;
  overlayRef?: React.RefObject<OverlayPanel>;
}

const SelectCountOverlay: React.FC<SelectCountOverlayProps> = ({
  selectCount,
  setSelectCount,
  onSubmit,
  overlayRef,
}) => {
  return (
    <OverlayPanel ref={overlayRef} dismissable>
      <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
        <InputNumber
          value={selectCount ?? undefined}
          onValueChange={(e) => setSelectCount(e.value ?? null)}
          onBlur={(e) => setSelectCount(Number(e.target.value) || null)}
          placeholder="Number of rows"
          min={1}
          showButtons={false}
          style={{ width: '100%' }}
        />
        <Button
          label="Submit"
          onClick={() => {
            if (!selectCount || selectCount <= 0) return;
            onSubmit();
          }}
        />
      </div>
    </OverlayPanel>
  );
};

export default SelectCountOverlay;
