import axios from 'axios';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyServer = searchParams.get('propertyServer');
    const propertyPortStay = searchParams.get('propertyPortStay');

    if (!propertyServer || !propertyPortStay) {
      return new Response(JSON.stringify({ error: 'Missing propertyServer or propertyPortStay' }), { status: 400, headers: { 'content-type': 'application/json' } });
    }

    const server = propertyServer.startsWith('http') ? propertyServer : `http://${propertyServer}`;
    const url = `${server}:${propertyPortStay}/getstaylogs`;

    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        Authorization: 'q4vf9p8n4907895f7m8d24m75c2q947m2398c574q9586c490q756c98q4m705imtugcfecvrhym04capwz3e2ewqaefwegfiuoamv4ros2nuyp0sjc3iutow924bn5ry943utrjmi',
      },
    });

    return new Response(JSON.stringify(response.data), { status: response.status, headers: { 'content-type': 'application/json' } });
  } catch (err) {
    console.error('proxyStayLogs error:', err?.response?.data || err.message || err);
    return new Response(JSON.stringify({ error: 'Failed to fetch stay logs' }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}
