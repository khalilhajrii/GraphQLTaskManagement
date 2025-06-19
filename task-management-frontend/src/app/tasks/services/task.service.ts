import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Task } from '../models/task.model';

// GraphQL queries and mutations
const GET_MY_TASKS = gql`
  query MyTasks {
    myTasks {
      id
      title
      description
      completed
      createdAt
      updatedAt
      user {
        id
        username
        fullName
      }
    }
  }
`;

const GET_TASK = gql`
  query Task($id: ID!) {
    task(id: $id) {
      id
      title
      description
      completed
      createdAt
      updatedAt
      user {
        id
        username
        fullName
      }
    }
  }
`;

const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      completed
      createdAt
      updatedAt
      user {
        id
        username
        fullName
      }
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      title
      description
      completed
      createdAt
      updatedAt
      user {
        id
        username
        fullName
      }
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private apollo: Apollo) { }

  getMyTasks(): Observable<Task[]> {
    return this.apollo.query({
      query: GET_MY_TASKS,
      fetchPolicy: 'network-only' // Don't use cache for this query
    }).pipe(
      map((result: any) => result.data.myTasks)
    );
  }

  getTask(id: number): Observable<Task> {
    return this.apollo.query({
      query: GET_TASK,
      variables: { id }
    }).pipe(
      map((result: any) => result.data.task)
    );
  }

  createTask(title: string, description?: string, completed: boolean = false): Observable<Task> {
    return this.apollo.mutate({
      mutation: CREATE_TASK,
      variables: {
        input: { title, description, completed }
      },
      refetchQueries: [
        { query: GET_MY_TASKS } // Refresh the task list after creating
      ]
    }).pipe(
      map((result: any) => result.data.createTask)
    );
  }

  updateTask(id: number, title?: string, description?: string, completed?: boolean): Observable<Task> {
    return this.apollo.mutate({
      mutation: UPDATE_TASK,
      variables: {
        id,
        input: { title, description, completed }
      },
      refetchQueries: [
        { query: GET_MY_TASKS } // Refresh the task list after updating
      ]
    }).pipe(
      map((result: any) => result.data.updateTask)
    );
  }

  deleteTask(id: number): Observable<boolean> {
    return this.apollo.mutate({
      mutation: DELETE_TASK,
      variables: { id },
      refetchQueries: [
        { query: GET_MY_TASKS } // Refresh the task list after deleting
      ]
    }).pipe(
      map((result: any) => result.data.deleteTask)
    );
  }
}