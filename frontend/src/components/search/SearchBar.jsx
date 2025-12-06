import { useState, Fragment } from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'motion/react';

export default function SearchBar({ onSearch, onClear, isSearching, hasResults, error }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    onClear();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

return (
    <Fragment>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Search</h2>
          <div className="flex gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground dark:text-gray-400 pointer-events-none"
                size={18}
              />
              <input
                type="text"
                placeholder="Search rooms, buildings, or campuses"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-32 py-3 bg-input-background dark:bg-gray-800 border-2 border-border rounded-lg transition-all focus:border-primary focus:outline-none text-foreground dark:text-gray-100 placeholder:text-muted-foreground dark:placeholder:text-gray-500"
              />
            </div>
            <motion.button
              onClick={handleSearch}
              disabled={isSearching}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground rounded-lg hover:bg-primary/90 dark:hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </motion.button>
            {hasResults && (
              <motion.button
                onClick={handleClear}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={20} />
              </motion.button>
            )}
          </div>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-2"
          >
            {error}
          </motion.p>
        )}
      
    </motion.div>
    </Fragment>
  );
}
