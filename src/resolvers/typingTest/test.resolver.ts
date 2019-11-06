import {Resolver, Mutation, Arg, Ctx, UseMiddleware, Query} from 'type-graphql'
import {generate} from '@typvp/gen'

import {getAccountId} from '../../utils'
import {Context} from '../../types'
import {IsAuthenticated} from '../../middleware/Auth'
import {LogAccess} from '../../middleware/Log'
import {NewTestInput} from './test.input'
import {Test} from './test.type'
import {PaginationArgs} from '../generic.args'

const wsCache: {[key: string]: string | string[]} = {}

@Resolver()
export class TestResolver {
  @Mutation(returns => Boolean)
  @UseMiddleware(IsAuthenticated, LogAccess)
  async addNewResult(@Arg('result') input: NewTestInput, @Ctx() ctx: Context) {
    const id = getAccountId(ctx) as string
    await ctx.prisma
      .createTest({
        account: {
          connect: {
            id: id,
          },
        },
        ...input,
        type: 'SINGLEPLAYER',
      })
      .catch(() => {
        return false
      })
    return true
  }

  @Mutation(returns => String)
  @UseMiddleware(LogAccess)
  async getWordSet(@Ctx() ctx: Context): Promise<string | string[]> {
    const id = getAccountId(ctx)
    const wordList = generate(250, {minLength: 3, maxLength: 8, join: '|'})
    if (id) {
      await ctx.prisma.updateAccount({
        where: {
          id,
        },
        data: {
          lastSeen: Date.now(),
          lastPlayed: 'SINGLEPLAYER',
        },
      })
      wsCache[id] = wordList
    }
    return wordList
  }

  @Query(returns => [Test])
  @UseMiddleware(LogAccess)
  async leaderboard(
    @Arg('filter') filter: PaginationArgs,
    @Ctx() ctx: Context,
  ) {
    return ctx.prisma.tests({
      skip: filter.skip,
      first: filter.first,
      orderBy: 'wpm_DESC',
    })
  }

  @Mutation(returns => Boolean)
  @UseMiddleware(LogAccess)
  async seen(@Ctx() ctx: Context): Promise<Boolean> {
    const id = getAccountId(ctx)
    if (id) {
      await ctx.prisma.updateAccount({
        where: {
          id,
        },
        data: {
          lastSeen: Date.now(),
        },
      })
      return true
    }
  }
}
