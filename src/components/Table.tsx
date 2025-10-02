import React from 'react';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Artwork } from '../types';
import { OverlayPanel } from 'primereact/overlaypanel';

interface ArtworkTableProps {
  artworks: Artwork[];
  loading: boolean;
  pagination: { page: number; rows: number };
  totalRecords: number;
  onPageChange: (e: DataTablePageEvent) => void;
  selectedRowIds: number[];
  setSelectedRowIds: (ids: number[]) => void;
  overlayRef: React.RefObject<OverlayPanel>;
}

const ArtworkTable: React.FC<ArtworkTableProps> = ({
  artworks,
  loading,
  pagination,
  totalRecords,
  onPageChange,
  selectedRowIds,
  setSelectedRowIds,
  overlayRef,
}) => {
  const selectedRows = artworks.filter((row) => selectedRowIds.includes(row.id));

  return (
    <DataTable
      value={artworks}
      selection={selectedRows}
      onSelectionChange={(e) => {
        const newSelectedIds = e.value?.map((row: Artwork) => row.id) || [];
        const otherIds = selectedRowIds.filter((id) => !artworks.some((r) => r.id === id));
        setSelectedRowIds([...otherIds, ...newSelectedIds]);
      }}
      dataKey="id"
      loading={loading}
      lazy
      paginator
      first={pagination.page * pagination.rows}
      rows={pagination.rows}
      totalRecords={totalRecords}
      onPage={onPageChange}
      responsiveLayout="scroll"
    >
      <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
      <Column
        header={() => (
          <div className="title-header">
            <button className="pi pi-chevron-down" onClick={(e) => overlayRef.current?.toggle(e)} />
            <span>Title</span>
          </div>
        )}
        body={(row: Artwork) => <span className="title-text">{row.title}</span>}
      />
      <Column field="place_of_origin" header="Place of Origin" />
      <Column field="artist_display" header="Artist" />
      <Column field="inscriptions" header="Inscriptions" />
      <Column field="date_start" header="Date Start" />
      <Column field="date_end" header="Date End" />
    </DataTable>
  );
};

export default ArtworkTable;
