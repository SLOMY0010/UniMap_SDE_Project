export const MOCK_SEARCH_RESULTS = {
  IFB101: {
    className: 'Introduction to Programming - IFB101',
    campus: 'Kassai Campus',
    campusAddress: 'Kassai út 26, Debrecen, 4028 Hungary',
    building: 'Faculty of Informatics',
    room: 'IF-101',
    floor: '1st Floor',
    googleMapUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2706.8434!2d21.623!3d47.533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDMxJzU4LjgiTiAyMcKwMzcnMjIuNCJF!5e0!3m2!1sen!2shu!4v1234567890',
    floorPlanImage:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    pinPosition: { x: 35, y: 45 },
  },
  IFB202: {
    className: 'Data Structures - IFB202',
    campus: 'Kassai Campus',
    campusAddress: 'Kassai út 26, Debrecen, 4028 Hungary',
    building: 'Faculty of Informatics',
    room: 'IF-202',
    floor: '2nd Floor',
    googleMapUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2706.8434!2d21.623!3d47.533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDMxJzU4LjgiTiAyMcKwMzcnMjIuNCJF!5e0!3m2!1sen!2shu!4v1234567890',
    floorPlanImage:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    pinPosition: { x: 60, y: 30 },
  },
  ENG101: {
    className: 'Mechanical Engineering Basics - ENG101',
    campus: 'Engineering Campus',
    campusAddress: 'Technology Park 1, Debrecen, 4032 Hungary',
    building: 'Engineering Building A',
    room: 'ENG-A-101',
    floor: '1st Floor',
    googleMapUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2706.8434!2d21.627!3d47.548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDMyJzUyLjgiTiAyMcKwMzcnMzcuMiJF!5e0!3m2!1sen!2shu!4v1234567890',
    floorPlanImage:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    pinPosition: { x: 50, y: 50 },
  },
  MAIN101: {
    className: 'General Studies - MAIN101',
    campus: 'Main Campus',
    campusAddress: 'University Square 1, Debrecen, 4032 Hungary',
    building: 'Main Building',
    room: 'MB-101',
    floor: '1st Floor',
    googleMapUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2706.8434!2d21.627!3d47.531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDMxJzUxLjYiTiAyMcKwMzcnMzcuMiJF!5e0!3m2!1sen!2shu!4v1234567890',
    floorPlanImage:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    pinPosition: { x: 25, y: 65 },
  },
};

export const CAMPUSES = [
  {
    name: 'Main Campus',
    address: 'University Square 1, Debrecen, 4032 Hungary',
    image:
      'https://images.unsplash.com/photo-1641238875178-b529cf9c77fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwbW9kZXJuJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzU5Nzc4Nzk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    displayName: 'Main\ncampus',
  },
  {
    name: 'Kassai Campus',
    address: 'Kassai út 26, Debrecen, 4028 Hungary',
    image:
      'https://images.unsplash.com/photo-1680444873773-7c106c23ac52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwY2FtcHVzJTIwdW5pdmVyc2l0eXxlbnwxfHx8fDE3NTk4NDY3OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    displayName: 'Kassai\ncampus',
  },
  {
    name: 'Engineering Campus',
    address: 'Technology Park 1, Debrecen, 4032 Hungary',
    image:
      'https://images.unsplash.com/photo-1645237448975-68f57e840a03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb3dudG93biUyMGNhbXB1cyUyMHVuaXZlcnNpdHl8ZW58MXx8fHwxNzU5ODQ2Nzk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    displayName: 'Engineering\ncampus',
  },
];