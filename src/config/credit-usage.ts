export const creditUsage = {
  // Audit Types (Each grid point requires a Places API nearby search)
  audits: {
    basic: {
      credits: 5, // 9 grid points (3x3) x 0.5 credits + 0.5 for place details
      features: {
        gridSize: '3x3',
        radius: 2,
        competitors: 3,
        metrics: ['rank', 'AGR', 'ATGR', 'SoLV'],
        apiCalls: {
          placesNearby: 9,
          placeDetails: 1
        }
      }
    },
    standard: {
      credits: 15, // 25 grid points (5x5) x 0.5 credits + 0.5 for place details
      features: {
        gridSize: '5x5',
        radius: 5,
        competitors: 5,
        metrics: ['rank', 'AGR', 'ATGR', 'SoLV', 'reviewMetrics', 'postMetrics'],
        apiCalls: {
          placesNearby: 25,
          placeDetails: 1,
          reviews: 1
        }
      }
    },
    comprehensive: {
      credits: 30, // 49 grid points (7x7) x 0.5 credits + 3.5 for detailed data
      features: {
        gridSize: '7x7',
        radius: 10,
        competitors: 10,
        metrics: ['rank', 'AGR', 'ATGR', 'SoLV', 'reviewMetrics', 'postMetrics', 'businessAttributes', 'competitorInsights'],
        apiCalls: {
          placesNearby: 49,
          placeDetails: 1,
          reviews: 1,
          businessProfile: 1
        }
      }
    }
  },

  // Report Types (Monthly tracking)
  reports: {
    keyword: {
      credits: 10, // Weekly tracking (4 updates x 2.5 credits)
      features: {
        historyLength: '30 days',
        updateFrequency: 'weekly',
        competitors: 3,
        apiCalls: {
          placesNearby: 4,
          placeDetails: 4
        }
      }
    },
    review: {
      credits: 5, // Daily review monitoring
      features: {
        historyLength: '30 days',
        sentimentAnalysis: true,
        responseTracking: true,
        apiCalls: {
          reviews: 30,
          businessProfile: 30
        }
      }
    },
    competitor: {
      credits: 15, // Weekly competitor monitoring
      features: {
        competitors: 5,
        metrics: ['rankings', 'reviews', 'posts', 'attributes'],
        historyLength: '30 days',
        apiCalls: {
          placesNearby: 4,
          placeDetails: 20,
          reviews: 4
        }
      }
    },
    performance: {
      credits: 20, // Comprehensive daily monitoring
      features: {
        metrics: ['rankings', 'visibility', 'engagement', 'reviews'],
        historyLength: '30 days',
        insights: true,
        apiCalls: {
          placesNearby: 30,
          placeDetails: 30,
          reviews: 30,
          businessProfile: 30
        }
      }
    }
  }
}