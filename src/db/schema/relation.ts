import { defineRelations } from 'drizzle-orm'
import * as schema from './index'

export const relations = defineRelations(
  {
    ...schema,
  },
  (r) => ({
    user: {
      account: r.one.account({
        from: r.user.id,
        to: r.account.userId,
      }),
      coachProfile: r.one.coachProfiles({
        from: r.user.id,
        to: r.coachProfiles.userId,
      }),
      reflectionAnalyses: r.many.reflectionAnalyses(),
      reflections: r.many.reflections(),
      session: r.one.session({
        from: r.user.id,
        to: r.session.userId,
      }),
    },
    coachProfiles: {
      reflections: r.many.reflections(),
      user: r.one.user({
        from: r.coachProfiles.userId,
        to: r.user.id,
        optional: false,
      }),
    },
    reflections: {
      analysis: r.one.reflectionAnalyses({
        from: r.reflections.id,
        to: r.reflectionAnalyses.reflectionId,
      }),
      profile: r.one.coachProfiles({
        from: r.reflections.profileId,
        to: r.coachProfiles.id,
      }),
      user: r.one.user({
        from: r.reflections.userId,
        to: r.user.id,
        optional: false,
      }),
    },
    reflectionAnalyses: {
      reflection: r.one.reflections({
        from: r.reflectionAnalyses.reflectionId,
        to: r.reflections.id,
        optional: false,
      }),
      user: r.one.user({
        from: r.reflectionAnalyses.userId,
        to: r.user.id,
        optional: false,
      }),
    },
  }),
)
