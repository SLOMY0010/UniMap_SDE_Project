export const getCampusPageName = (campusDisplayName) => {
  const campusMap = {
    'Main\\ncampus': 'main-campus',
    'Kassai\\ncampus': 'kassai-campus',
    'Engineering\\ncampus': 'engineering-campus',
  };
  return campusMap[campusDisplayName] || 'campus';
};

export const getPageTitle = (currentPage, selectedBuilding = '') => {
  const pageTitles = {
    campus: 'All Campuses',
    calendar: 'My Classes',
    'main-campus': 'Main Campus',
    'kassai-campus': 'Kassai Campus',
    'engineering-campus': 'Engineering Campus',
    'building-map': `${selectedBuilding} Map`,
  };
  return pageTitles[currentPage] || 'Campus Navigation';
};

export const formatUserInitials = (username) => {
  return username.substring(0, 2).toUpperCase();
};
