// Initialize mock data for the application
export const initializeMockData = () => {
  // Check if data already exists
  if (localStorage.getItem('dataInitialized')) {
    return;
  }

  // Sample users
  const users = [
    {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      credits: 45,
      redeemCodes: []
    },
    {
      id: 'user-2',
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      role: 'user',
      credits: 120,
      redeemCodes: ['ABC123']
    },
    {
      id: 'user-3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'user',
      credits: 78,
      redeemCodes: []
    }
  ];

  // Sample complaints
  const complaints = [
    {
      id: 'complaint-1',
      userId: 'user-1',
      userName: 'John Doe',
      photo: '/placeholder.svg',
      location: 'Main Street near Central Park',
      description: 'Large pile of plastic waste dumped near the park entrance. Has been there for over a week.',
      status: 'pending',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'complaint-2',
      userId: 'user-2',
      userName: 'Sarah Smith',
      photo: '/placeholder.svg',
      location: 'Sector 15, Bus Stop Area',
      description: 'Overflowing garbage bins causing health hazards. Attracting stray animals.',
      status: 'assigned',
      assignedWorker: '2',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'complaint-3',
      userId: 'user-3',
      userName: 'Mike Johnson',
      photo: '/placeholder.svg',
      location: 'Market Road, Shop No. 45',
      description: 'Electronic waste dumped on sidewalk. Contains old computers and monitors.',
      status: 'resolved',
      assignedWorker: '1',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Sample reports
  const reports = [
    {
      id: 'report-1',
      userId: 'user-1',
      userName: 'John Doe',
      complaintId: 'complaint-1',
      description: 'Assigned worker did not show up at scheduled time. Issue still persists.',
      handled: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Sample redeem codes
  const redeemCodes = [
    {
      id: 'redeem-1',
      userId: 'user-2',
      code: 'ABC123',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Save to localStorage
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('complaints', JSON.stringify(complaints));
  localStorage.setItem('reports', JSON.stringify(reports));
  localStorage.setItem('redeemCodes', JSON.stringify(redeemCodes));
  localStorage.setItem('dataInitialized', 'true');
};

// Clean up data (useful for development)
export const clearMockData = () => {
  localStorage.removeItem('users');
  localStorage.removeItem('complaints');
  localStorage.removeItem('reports');
  localStorage.removeItem('redeemCodes');
  localStorage.removeItem('dataInitialized');
  localStorage.removeItem('currentUser');
};