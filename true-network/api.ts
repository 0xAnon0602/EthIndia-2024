import express, { Request, Response } from 'express';
import { flip } from './schemas'
import { getTrueNetworkInstance } from './true-network/true.config'

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


app.post('/attestFlip', async (req: any, res: any) => {
    try {
        const { wallet, result } = req.body;

        if (typeof wallet !== 'string' || typeof result !== 'number') {
            return res.status(400).json({ error: 'Invalid input' });
        }

        console.log(`Received result: ${result}, wallet: ${wallet}`);

        const api = await getTrueNetworkInstance();

        const hash = await flip.attest(api, wallet, {
            result: result,
            timestamp: Math.floor(Date.now() / 1000),
        });
        await api.network.disconnect();

        return res.status(200).json({ error:false, hash: hash });
    } catch (error) {
        console.error('Error attesting flip:', error);
        return res.status(500).json({ error: true, hash:'' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
