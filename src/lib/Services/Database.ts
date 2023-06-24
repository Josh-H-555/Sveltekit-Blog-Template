// create the prisma client, export it out for use in other components.

import { PrismaClient } from '@prisma/client';

export const db = new PrismaClient();
