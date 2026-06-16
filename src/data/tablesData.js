/**
 * Table definitions for the café.
 * Each table has a unique QR code URL.
 */

export const tables = [
  { id: 'table-1', number: 1, label: 'Table 1', isActive: true },
  { id: 'table-2', number: 2, label: 'Table 2', isActive: true },
  { id: 'table-3', number: 3, label: 'Table 3', isActive: true },
  { id: 'table-4', number: 4, label: 'Table 4', isActive: true },
  { id: 'table-5', number: 5, label: 'Table 5', isActive: true },
  { id: 'table-6', number: 6, label: 'Table 6', isActive: true },
  { id: 'table-7', number: 7, label: 'Table 7', isActive: true },
  { id: 'table-8', number: 8, label: 'Table 8', isActive: true },
  { id: 'table-9', number: 9, label: 'Table 9 (Outdoor)', isActive: true },
  { id: 'table-10', number: 10, label: 'Table 10 (Outdoor)', isActive: true },
  { id: 'table-11', number: 11, label: 'Table 11 (VIP)', isActive: false },
  { id: 'table-12', number: 12, label: 'Table 12 (VIP)', isActive: false },
];

export function getQrUrl(baseUrl, tableNumber) {
  return `${baseUrl}/menu?table=${tableNumber}`;
}

export default tables;
