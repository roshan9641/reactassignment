import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { OverlayPanel } from 'primereact/overlaypanel';
import ArtworkTable from './Table';
import SelectCountOverlay from './SelectCountOverlay';
import { Artwork } from '../types';

const DataTableComponent: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({ page: 0, rows: 12 });
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const [selectCount, setSelectCount] = useState<number | null>(null);

  const overlayRef = useRef<OverlayPanel>(null);

  const fetchArtworks = useCallback(async (page: number, rows: number) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.artic.edu/api/v1/artworks?page=${page + 1}&limit=${rows}`
      );
      const { data, pagination: apiPagination } = res.data;

      const mapped: Artwork[] = data.map((item: any) => ({
        id: item.id,
        title: item.title || 'N/A',
        artist_display: item.artist_display || 'Unknown',
        place_of_origin: item.place_of_origin || 'Unknown',
        inscriptions: item.inscriptions || '',
        date_start: item.date_start || null,
        date_end: item.date_end || null,
      }));

      setArtworks(mapped);
      setTotalRecords(apiPagination.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtworks(pagination.page, pagination.rows);
  }, [pagination, fetchArtworks]);

  const onPageChange = (e: { page: number; rows: number }) => {
    setPagination({ page: e.page, rows: e.rows });
  };

  const handleSelectCountSubmit = async () => {
    if (!selectCount || selectCount <= 0) return;

    let remaining = selectCount;
    let newSelectedIds: number[] = [];
    let page = pagination.page;
    const rowsPerPage = pagination.rows;

    while (remaining > 0) {
      try {
        const res = await axios.get(
          `https://api.artic.edu/api/v1/artworks?page=${page + 1}&limit=${rowsPerPage}`
        );
        const { data, pagination: apiPagination } = res.data;

        const ids = data.map((item: any) => item.id);
        const unselectedIds = ids.filter((id) => !newSelectedIds.includes(id));
        const toAdd = unselectedIds.slice(0, remaining);

        newSelectedIds = [...newSelectedIds, ...toAdd];
        remaining -= toAdd.length;

        if (page + 1 >= apiPagination.total_pages) break;
        page += 1;
      } catch (err) {
        console.error(err);
        break;
      }
    }

    setSelectedRowIds(newSelectedIds);
    setSelectCount(null);
    overlayRef.current?.hide();
    fetchArtworks(pagination.page, pagination.rows);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <SelectCountOverlay
        selectCount={selectCount}
        setSelectCount={setSelectCount}
        onSubmit={handleSelectCountSubmit}
        overlayRef={overlayRef}
      />

      <ArtworkTable
        artworks={artworks}
        loading={loading}
        pagination={pagination}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        selectedRowIds={selectedRowIds}
        setSelectedRowIds={setSelectedRowIds}
        overlayRef={overlayRef}
      />
    </div>
  );
};

export default DataTableComponent;
