import {Context} from '../../types'
import {getAccountId} from '../../utils'

export const SingleplayerMutations = {
  addResults: async (
    _: any,
    {cpm, rawCpm, wpm, correct, incorrect, corrections}: any,
    ctx: Context,
  ) => {
    const accountId = getAccountId(ctx)

    return await ctx.prisma.createTest({
      account: {
        connect: {
          id: accountId,
        },
      },
      cpm,
      rawCpm,
      wpm,
      correct,
      incorrect,
      corrections,
    })
  },
}