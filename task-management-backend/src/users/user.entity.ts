import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Task } from '../tasks/task.entity';

@ObjectType()
@Entity()
export class User {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    fullName: string;

    @Field()
    @Column({ unique: true })
    username: string;

    @Column()
    password: string; // Password is not exposed in GraphQL

    @Field(() => [Task], { nullable: true })
    @OneToMany(() => Task, task => task.user)
    tasks: Task[];

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}