import { NextApiRequest, NextApiResponse } from "next";
import { addLocation } from "src/app/services/savedlocation.service";

export default async function handle(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method === 'POST') {
        const { id, name, latitude, longtitude } = req.body;

        if (!id || !name || !latitude || !longtitude) {
            res.status(400).end(`Missing required input parameters.`);
        }

        try {
            const newLocation: PlaceLocation = {
                id: id,
                name: name,
                latitude: latitude,
                longtitude: longtitude
            }
            await addLocation(newLocation);
        } catch (error: any) {
            res.status(400).end(error.message);
        }

        res.status(200).json({ message: 'Location saved successfully.' });

    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}