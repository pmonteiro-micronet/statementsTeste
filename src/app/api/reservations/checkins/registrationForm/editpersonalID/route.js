// src/api/reservations/checkins/registrationForm/editpersonalID.js
import axios from "axios";

export async function POST(request) {
    try {
        const body = await request.json();

        const {
            authorization,
            Dateofbirth,
            IDCountryofBirth,
            Nationality,
            IDDoc,
            DocNr,
            Expdate,
            Issue,
            profileID,
        } = body;

        const headers = {
            Authorization:
                authorization ||
                "q4vf9p8n4907895f7m8d24m75c2q947m2398c574q9586c490q756c98q4m705imtugcfecvrhym04capwz3e2ewqaefwegfiuoamv4ros2nuyp0sjc3iutow924bn5ry943utrjmi",
            DateOfbirth: Dateofbirth,
            IDCountryOfBirth: parseInt(IDCountryofBirth),
            Nationality: parseInt(Nationality),
            IDDoc: parseInt(IDDoc),
            DocNr: parseInt(DocNr),
            Expdate: Expdate,
            Issue: Issue,
            ProfileID: parseInt(profileID),
        };

        const url = `http://${propertyServer}:${propertyPortStay}/editpersonal`;
        const response = await axios.post(url, null, { headers });

        return new Response(JSON.stringify(response.data), {
            status: response.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Proxy error:", error?.response?.data || error.message);

        const status = error.response?.status || 500;
        const message =
            error.response?.data || { message: "Internal Server Error" };

        return new Response(JSON.stringify(message), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
}
