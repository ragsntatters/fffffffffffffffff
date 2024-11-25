export const apiUsage = {
  // One-time Audits
  audits: {
    basic: {
      // 3x3 grid = 9 points
      apiCalls: {
        placesNearby: 9,     // Search ranking at each grid point
        placeDetails: 1,     // Get business details
        businessProfile: 1    // Get business profile data
      },
      features: {
        gridSize: '3x3',
        radius: 2,
        competitors: 3
      }
    },
    standard: {
      // 5x5 grid = 25 points
      apiCalls: {
        placesNearby: 25,    // Search ranking at each grid point
        placeDetails: 6,     // Business + top 5 competitors
        businessProfile: 1,   // Get business profile data
        reviews: 1           // Get review data
      },
      features: {
        gridSize: '5x5',
        radius: 5,
        competitors: 5
      }
    },
    comprehensive: {
      // 7x7 grid = 49 points
      apiCalls: {
        placesNearby: 49,    // Search ranking at each grid point
        placeDetails: 11,    // Business + top 10 competitors
        businessProfile: 1,   // Get business profile data
        reviews: 1,          // Get review data
        posts: 1             // Get posts data
      },
      features: {
        gridSize: '7x7',
        radius: 10,
        competitors: 10
      }
    }
  },

  // Monthly Reports (30-day period)
  reports: {
    keyword: {
      // Weekly tracking
      apiCalls: {
        placesNearby: 36,    // 9 grid points x 4 weeks
        placeDetails: 4,     // Business details weekly
        businessProfile: 4    // Profile check weekly
      },
      features: {
        updateFrequency: 'weekly',
        gridSize: '3x3',
        competitors: 3
      }
    },
    review: {
      // Daily monitoring
      apiCalls: {
        reviews: 30,         // Daily review checks
        businessProfile: 30   // Daily profile checks
      },
      features: {
        updateFrequency: 'daily',
        sentimentAnalysis: true,
        responseTracking: true
      }
    },
    competitor: {
      // Weekly monitoring
      apiCalls: {
        placesNearby: 4,     // Weekly area search
        placeDetails: 20,    // 5 competitors x 4 weeks
        reviews: 20,         // 5 competitors x 4 weeks
        businessProfile: 4    // Weekly profile check
      },
      features: {
        updateFrequency: 'weekly',
        competitors: 5,
        metrics: ['rankings', 'reviews', 'posts', 'attributes']
      }
    },
    performance: {
      // Daily comprehensive monitoring
      apiCalls: {
        placesNearby: 30,    // Daily ranking checks
        placeDetails: 30,    // Daily business checks
        reviews: 30,         // Daily review monitoring
        businessProfile: 30,  // Daily profile checks
        posts: 30            // Daily post monitoring
      },
      features: {
        updateFrequency: 'daily',
        metrics: ['rankings', 'visibility', 'engagement', 'reviews']
      }
    }
  }
}

// Google API endpoints used:
// - Places API Nearby Search: Search for businesses in an area
// - Place Details API: Get detailed business information
// - Business Profile API: Get business profile, reviews, and posts
// - Maps JavaScript API: Display maps and grid visualization