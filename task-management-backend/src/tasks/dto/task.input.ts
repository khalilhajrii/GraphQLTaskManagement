import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTaskInput {
    @Field()
    title: string;

    @Field({ nullable: true })
    description?: string;

    @Field({ defaultValue: false })
    completed: boolean;

    @Field({ nullable: true })
    userId?: number;
}

@InputType()
export class UpdateTaskInput {
    @Field({ nullable: true })
    title?: string;

    @Field({ nullable: true })
    description?: string;

    @Field({ nullable: true })
    completed?: boolean;
}