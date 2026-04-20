'use client';

import { format } from 'date-fns';

import type { ContractOutputs } from '@krak/contracts';
import { Badge, DataTableColumnHeader, KrakImage } from '@krak/ui';

import type { ColumnDef } from '@tanstack/react-table';

export type AdminMap = ContractOutputs['admin']['maps']['list']['maps'][number];

const categoryLabels: Record<string, string> = {
  maps: 'Maps',
  video: 'Video',
  skater: 'Skaters',
  filmer: 'Filmers',
  photographer: 'Photographers',
  magazine: 'Magazines',
  skatepark: 'Skateparks',
  shop: 'Shops',
  years: 'Years',
  greatest: 'Greatest',
  members: 'Members',
  artist: 'Artists',
};

export const columns: ColumnDef<AdminMap>[] = [
  {
    id: 'image',
    header: 'Image',
    enableSorting: false,
    cell: ({ row }) => (
      <KrakImage
        path={`assets/maps/custom-maps/${row.original.id}.png`}
        alt={row.original.name}
        options={{ width: 80, height: 80, resizingType: 'fill', format: 'webp' }}
        className="size-10 rounded object-cover"
      />
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.getValue('name')}</span>
          {row.original.staging && (
            <Badge variant="outline" className="text-xs">
              Staging
            </Badge>
          )}
        </div>
        {row.original.subtitle && (
          <span className="text-sm text-muted-foreground">{row.original.subtitle}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'categories',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Categories" />,
    enableSorting: false,
    cell: ({ row }) => {
      const categories = row.getValue('categories') as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <Badge key={cat} variant="secondary">
              {categoryLabels[cat] ?? cat}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return <span className="text-muted-foreground">{format(date, 'PP')}</span>;
    },
  },
];
