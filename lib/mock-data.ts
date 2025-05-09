import type { Ride } from "./types"

export const mockRides: Ride[] = [
  {
    id: "ride-1",
    passengerName: "Rahul Sharma",
    pickup: "MG Road, Bengaluru",
    dropoff: "Koramangala 5th Block, Bengaluru",
    estimatedTime: 15,
    distance: 5.2,
    fare: "₹250",
    status: "accepted",
    passengerPhone: "+91 98765 43210",
  },
  {
    id: "ride-2",
    passengerName: "Priya Patel",
    pickup: "Indiranagar 100ft Road, Bengaluru",
    dropoff: "HSR Layout Sector 2, Bengaluru",
    estimatedTime: 22,
    distance: 7.8,
    fare: "₹320",
    status: "accepted",
    passengerPhone: "+91 87654 32109",
  },
  {
    id: "ride-3",
    passengerName: "Amit Kumar",
    pickup: "Whitefield, Bengaluru",
    dropoff: "Electronic City Phase 1, Bengaluru",
    estimatedTime: 35,
    distance: 18.5,
    fare: "₹450",
    status: "accepted",
    passengerPhone: "+91 76543 21098",
  },
]

export const DEFAULT_RIDE_OTP = "123456"
