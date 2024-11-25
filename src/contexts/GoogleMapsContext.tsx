import { createContext, useContext, useEffect, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { config } from '../config'

interface GoogleMapsContextType {
  isLoaded: boolean
  loadError: Error | null
  google?: typeof google
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: null
})

export function useGoogleMaps() {
  const context = useContext(GoogleMapsContext)
  if (!context) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider')
  }
  return context
}

interface GoogleMapsProviderProps {
  children: React.ReactNode
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<Error | null>(null)
  const [googleInstance, setGoogleInstance] = useState<typeof google>()

  useEffect(() => {
    if (!config.google.apiKey) {
      setLoadError(new Error('Google Maps API key is not configured'))
      return
    }

    const loader = new Loader({
      apiKey: config.google.apiKey,
      version: 'weekly',
      libraries: config.google.mapsLibraries,
      mapIds: [config.google.mapId],
      authReferrerPolicy: 'origin'
    })

    loader.load()
      .then((google) => {
        setGoogleInstance(google)
        setIsLoaded(true)
      })
      .catch((error) => {
        console.error('Google Maps load error:', error)
        setLoadError(error)
      })

    return () => {
      // Cleanup if needed
      const maps = window.google?.maps
      if (maps) {
        // Remove any event listeners or cleanup maps instances
        const elements = document.getElementsByClassName('gm-style')
        while (elements.length > 0) {
          elements[0].parentNode?.removeChild(elements[0])
        }
      }
    }
  }, [])

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError, google: googleInstance }}>
      {children}
    </GoogleMapsContext.Provider>
  )
}