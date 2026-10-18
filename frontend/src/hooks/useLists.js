import { useEffect, useState } from 'react';
import { getLists } from '../api/lists.js';

// Owner: Manvendra. Dropdown lists, e.g. lists.budgetHead, lists.department. Empty lists until loaded.
export function useLists() {
  const [lists, setLists] = useState({ department: [], budgetHead: [], designation: [], deliveryPeriod: [] });
  useEffect(() => {
    getLists().then(setLists).catch(() => {});
  }, []);
  return [lists, setLists];
}
