import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/mongo-helper";

interface ResponseFuncs {
  POST?: (req: NextApiRequest, res: NextApiResponse) => void;
}

interface PolkaAddressCheckResponse {
  exists: boolean;
  error?: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Authenticate the request
  if (!(req.headers["x-middleware-auth"] === process.env.KEY)) {
    return res.status(401).json({ error: "Unauthorized call" });
  }

  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;
  const catcher = (error: Error) =>
    res.status(400).json({ error: error.message });

  const handleCase: ResponseFuncs = {
    POST: async (req: NextApiRequest, res: NextApiResponse<PolkaAddressCheckResponse>) => {
      const { User } = await connect();
      const { polka_address } = req.body;

      // Find user with matching polka_address
      const existingUser = await User.findOne({ polka_address }).catch(catcher);

      if (existingUser) {
        return res.json({ exists: true });
      } else {
        return res.json({ exists: false });
      }
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
