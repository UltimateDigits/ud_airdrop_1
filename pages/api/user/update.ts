import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/mongo-helper";

interface ResponseFuncs {
  GET?: Function;
  POST?: Function;
  PUT?: Function;
  DELETE?: Function;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!(req.headers["x-middleware-auth"] === process.env.KEY)) {
    res.status(401).json({ error: "Unauthorized call" });
  }
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  //function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error });

  // Potential Responses
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const { User } = await connect();
      const { address } = req.body;
      delete req.body["address"];
      const { _id } = await User.findOne({ address: address });
      res.json(
        await User.findByIdAndUpdate({ _id: _id }, req.body).catch(catcher)
      );
    },
  };

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
