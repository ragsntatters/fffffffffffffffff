export const plans = {
  starter: {
    name: 'Starter',
    price: 49,
    features: {
      locations: 3,
      gridPoints: '1,500 grid points/mo',
      searchQueries: '500 searches/mo',
      audits: {
        type: 'basic',
        monthly: 5
      },
      reports: {
        keyword: true,
        scheduled: false
      },
      reviews: {
        monitoring: 'Daily monitoring',
        response: true
      },
      support: 'email'
    }
  },
  professional: {
    name: 'Professional',
    price: 89,
    features: {
      locations: 10,
      gridPoints: '5,000 grid points/mo',
      searchQueries: '2,500 searches/mo',
      audits: {
        type: ['basic', 'standard', 'comprehensive'],
        monthly: 20
      },
      reports: {
        keyword: true,
        scheduled: true
      },
      reviews: {
        monitoring: 'Real-time monitoring',
        response: true
      },
      posting: {
        platforms: ['google', 'facebook', 'instagram'],
        scheduling: true
      },
      widget: true,
      support: 'priority'
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 190,
    features: {
      locations: 70,
      gridPoints: '20,000 grid points/mo',
      searchQueries: '10,000 searches/mo',
      audits: {
        type: ['basic', 'standard', 'comprehensive'],
        monthly: 'unlimited'
      },
      reports: {
        keyword: true,
        scheduled: true
      },
      reviews: {
        monitoring: 'Real-time monitoring',
        response: true
      },
      posting: {
        platforms: ['google', 'facebook', 'instagram'],
        scheduling: true
      },
      widget: true,
      support: '24/7 dedicated'
    }
  }
}

// API Usage Details:
// Basic Audit (3x3): 9 grid points + business details
// Standard Audit (5x5): 25 grid points + competitor analysis
// Comprehensive Audit (7x7): 49 grid points + full competitive analysis
// Daily Rank Tracking: 1 search per keyword per day
// Real-time Monitoring: Up to 24 checks per day
// Grid Point: One location search in the grid
// Search Query: One keyword rank check