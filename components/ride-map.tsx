// "use client"

// import { Card, CardContent } from "@/components/ui/card"
// import { useLocale } from "@/components/locale-provider"

// interface RideMapProps {
//   ride: any
// }

// export function RideMap({ ride }: RideMapProps) {
//   const { t } = useLocale()

//   return (
//     <Card>
//       <CardContent className="p-0">
//         <div className="relative">
//           {/* This would be replaced with an actual map component */}
//           <div className="h-48 bg-gray-200 flex items-center justify-center">
//             <p className="text-gray-500">{t("mapPlaceholder")}</p>
//           </div>

//           {/* Navigation instructions would appear here */}
//           {ride.status === "inProgress" && (
//             <div className="absolute bottom-0 left-0 right-0 bg-white p-3 border-t">
//               <p className="font-medium">{t("continueOn")} Main St</p>
//               <p className="text-sm text-gray-500">2.5 km</p>
//             </div>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
"use client"

import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface RideMapProps {
  ride: {
    pickup: string
    dropoff: string
  }
}

export function RideMap({ ride }: RideMapProps) {
  const [pickupLocation, setPickupLocation] = useState<google.maps.LatLngLiteral | null>(null)
  const [dropoffLocation, setDropoffLocation] = useState<google.maps.LatLngLiteral | null>(null)
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  })

  useEffect(() => {
    if (!isLoaded) return

    const geocoder = new google.maps.Geocoder()

    geocoder.geocode({ address: ride.pickup }, (results, status) => {
      if (status === "OK" && results[0]) {
        setPickupLocation(results[0].geometry.location.toJSON())
      }
    })

    geocoder.geocode({ address: ride.dropoff }, (results, status) => {
      if (status === "OK" && results[0]) {
        setDropoffLocation(results[0].geometry.location.toJSON())
      }
    })
  }, [isLoaded, ride.pickup, ride.dropoff])

  useEffect(() => {
    if (!pickupLocation || !dropoffLocation) return

    const directionsService = new google.maps.DirectionsService()

    directionsService.route(
      {
        origin: pickupLocation,
        destination: dropoffLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result)
        } else {
          console.error("Directions request failed", status)
        }
      }
    )
  }, [pickupLocation, dropoffLocation])

  const center = pickupLocation || { lat: 12.9716, lng: 77.5946 }

  if (!isLoaded) return <div className="p-4 text-sm text-gray-500">Loading map...</div>

  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative h-64 w-full">
          <GoogleMap
            center={center}
            zoom={13}
            mapContainerStyle={{ width: "100%", height: "100%" }}
          >
            {pickupLocation && <Marker position={pickupLocation} label="Pickup" />}
            {dropoffLocation && <Marker position={dropoffLocation} label="Dropoff" />}
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        </div>
      </CardContent>
    </Card>
  )
}
