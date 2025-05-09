export type RideStatus = "accepted" | "arrived" | "inProgress" | "completed" | "cancelled"

export interface Ride {
  id: string
  passengerName: string
  pickup: string
  dropoff: string
  estimatedTime: number
  distance: number
  fare: string
  status: RideStatus
  passengerPhone: string
}
