import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { TrialUpdateWithoutTestDataInput } from "../inputs/TrialUpdateWithoutTestDataInput";
import { TrialWhereUniqueInput } from "../inputs/TrialWhereUniqueInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class TrialUpdateWithWhereUniqueWithoutTestInput {
  @Field(_type => TrialWhereUniqueInput, {
    nullable: false,
    description: undefined
  })
  where!: TrialWhereUniqueInput;

  @Field(_type => TrialUpdateWithoutTestDataInput, {
    nullable: false,
    description: undefined
  })
  data!: TrialUpdateWithoutTestDataInput;
}