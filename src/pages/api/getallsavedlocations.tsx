import { NextApiRequest, NextApiResponse } from "next";
import { getAllLocations } from "src/app/services/savedlocation.service";

export default async function handle(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method === 'GET') {
        try {
            const savedLocations = await getAllLocations();
            res.status(200).json(savedLocations);
        } catch (error: any) {
            res.status(400).end(error.message);
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};