import { useState } from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import { MOCK_SEARCH_RESULTS } from '../../constants/mockData';

export default function ClassSearch({ onSearchStateChange }) {
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = (query) => {
    setIsSearching(true);
    setError('');

    setTimeout(() => {
      const result = MOCK_SEARCH_RESULTS[query.toUpperCase()];

      if (result) {
        setSearchResult(result);
        onSearchStateChange?.(true);
      } else {
        setError('Class not found. Try: IFB101, IFB202, ENG101, or MAIN101');
        setSearchResult(null);
        onSearchStateChange?.(false);
      }
      setIsSearching(false);
    }, 800);
  };

  const handleClear = () => {
    setSearchResult(null);
    setError('');
    onSearchStateChange?.(false);
  };

  return (
    <div className="w-full">
      <SearchBar
        onSearch={handleSearch}
        onClear={handleClear}
        isSearching={isSearching}
        hasResults={!!searchResult}
        error={error}
      />
      <SearchResults result={searchResult} />
    </div>
  );
}
