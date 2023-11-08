const master: Menu[] = [
    {
        key: 'Master Department',
        label: 'Master Department',
        path: '/department'
    },
    {
        key: 'Master Customer',
        label: 'Master Customer',
        path: '/customer'
    },
    {
        key: 'Master Vehicle',
        label: 'Master Vehicle',
        path: '/vehicle'
    },
    {
        key: 'Master Part',
        label: 'Master Part',
        path: '/part'
    },
    {
        key: 'Master Pallet',
        label: 'Master Pallet',
        path: '/pallet'
    },
    {
        key: 'Master Destinasi',
        label: 'Master Destinasi',
        path: '/destinasi'
    },
    // {
    //     key: 'Master Orders',
    //     label: 'Master Orders',
    //     path: '/order'
    // },
    {
        key: 'Master SO',
        label: 'Master SO',
        path: '/stockopname'
    },
]

const laporan: Menu[] = [
    {
        key: 'Laporan Riwayat',
        label: 'Laporan Riwayat',
        path: '/history'
    },
    {
        key: 'Laporan Stok',
        label: 'Laporan Stok',
        path: '/stok'
    },
    {
        key: 'Laporan Maintenance',
        label: 'Laporan Maintenance',
        path: '/maintenance'
    },
    {
        key: 'Laporan SO',
        label: 'Laporan SO',
        path: '/lapso'
    },
    {
        key: 'Tracking SO',
        label: 'Tracking SO',
        path: '/trackingso'
    },
]

const delivery: Menu[] = [
    {
        key: 'Data Delivery',
        label: 'Data Delivery',
        path: '/delivery'
    },
]


export interface Menu {
    key: string,
    label: string,
    path?: string,
}

export {master,laporan, delivery}