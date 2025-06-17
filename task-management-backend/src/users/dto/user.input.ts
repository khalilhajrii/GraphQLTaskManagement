import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { User } from '../user.entity';

@InputType()
export class CreateUserInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    username: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}

@InputType()
export class LoginInput {
    @Field()
    @IsNotEmpty()
    username: string;

    @Field()
    @IsNotEmpty()
    password: string;
}

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;

  @Field(() => User, { nullable: true })
  user?: User;
}