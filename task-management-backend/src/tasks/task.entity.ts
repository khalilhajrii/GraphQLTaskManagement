import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../users/user.entity';
@ObjectType()
@Entity()
export class Task {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    title: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    description?: string;

    @Field()
    @Column({ default: false })
    completed: boolean;

    @Field(() => User)
    @ManyToOne(() => User, user => user.tasks, { eager: true })
    user: User;

    @Column({ nullable: true })
    userId: number;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}