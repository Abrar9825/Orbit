export const DASHBOARD_CARDS = [
  {
    id: 'configuration',
    title: 'Configuration',
    subtitle: 'System Setup',
    iconClass: 'fas fa-cogs',
    target: '/configuration/view',
    animationClass: 'card-1'
  },
  {
    id: 'stock',
    title: 'Stock',
    subtitle: 'Inventory',
    iconClass: 'fas fa-boxes',
    target: '/stock',
    animationClass: 'card-2'
  },
  {
    id: 'orders',
    title: 'Orders',
    subtitle: 'Manage all orders',
    subtitleClass: 'text-slate-200 text-xs font-medium relative z-10',
    iconClass: 'fas fa-shopping-cart',
    target: '01_dashboard.html',
    animationClass: 'card-3'
  },
  {
    id: 'expense',
    title: 'Expense',
    subtitle: 'Track expenses',
    iconClass: 'fas fa-wallet',
    target: '09_expense_management.html',
    animationClass: 'card-4'
  },
  {
    id: 'workers',
    title: 'Workers',
    subtitle: 'Attendance',
    iconClass: 'fas fa-user-check',
    target: '06_worker_management_new.html',
    animationClass: 'card-5'
  },
  {
    id: 'challan',
    title: 'Challan',
    subtitle: 'Outsource',
    iconClass: 'fas fa-file-invoice',
    target: '11_challan_list.html',
    animationClass: 'card-6'
  }
];
