import { useState } from 'react';
import ClassSearch from './search/ClassSearch';
import CampusGrid from './campus/CampusGrid';

export default function CampusSelection({ onCampusClick }) {
  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
    <div className="w-full">
      <ClassSearch onSearchStateChange={setIsSearchActive} />
      {!isSearchActive && <CampusGrid onCampusClick={onCampusClick} />}
    </div>
  );
}
