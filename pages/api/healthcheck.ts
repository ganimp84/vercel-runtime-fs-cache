// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as fs from 'fs';

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const basePath = process.cwd() + '/cache/'
  const buffer = fs.readFileSync(basePath + '/app.json', 'utf-8')
  res.status(200).json(JSON.parse(buffer))
}
