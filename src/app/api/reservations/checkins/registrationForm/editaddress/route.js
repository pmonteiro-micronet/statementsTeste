// pages/api/reservations/checkins/registrationForm/editaddress.js
import axios from "axios";

export default async function handler(req, res) {
    console.log("Incoming method:", req.method);
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const {
            authorization,
            countryid,
            streetaddress,
            postalcode,
            city,
            stateprovinceregion,
            profileid,
        } = req.headers;

        const headers = {
            Authorization: authorization || 'q4vf9p8n4907895f7m8d24m75c2q947m2398c574q9586c490q756c98q4m705imtugcfecvrhym04capwz3e2ewqaefwegfiuoamv4ros2nuyp0sjc3iutow924bn5ry943utrjmi',
            CountryID: parseInt(countryid),
            StreetAddress: streetaddress,
            PostalCode: postalcode,
            City: city,
            StateProvinceRegion: stateprovinceregion,
            ProfileID: parseInt(profileid),
        };

        const url = `http://${propertyServer}:${propertyPortStay}/editaddress`;
        const response = await axios.post(url, null, { headers });

        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error("Proxy error:", error?.response?.data || error.message);

        const status = error.response?.status || 500;
        const message = error.response?.data || { message: "Internal Server Error" };

        return res.status(status).json(message);
    }
}


