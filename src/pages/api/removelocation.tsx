import { NextApiRequest, NextApiResponse } from "next";
import { removeLocation } from "src/app/services/savedlocation.service";

export default async function handle(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method === 'DELETE') {
        const { cityId } = req.query;

        try {
            await removeLocation(+cityId);
        } catch (error: any) {
            res.status(400).end(error.message);
        }
        res.status(200).json({ message: `Location id ${cityId} removed successfully.` });

    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}