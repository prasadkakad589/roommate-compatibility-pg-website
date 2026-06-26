import axios from "axios";

export const calculateDistance = async (lat1, lng1, lat2, lng2) => {
    const response = await axios.get(
        "https://maps.googleapis.com/maps/api/distancematrix/json",
        {
            params: {
                origins: `${lat1},${lng1}`,
                destinations: `${lat2},${lng2}`,
                key: process.env.GOOGLE_MAP_KEY,
            },
        }
    );

    const element = response.data?.rows?.[0]?.elements?.[0];

    if (!element || element.status !== "OK") {
        throw new Error(`Google Maps error: ${element?.status || "no element"}`);
    }

    return element.distance.value / 1000; // metres → km
};