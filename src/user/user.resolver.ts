import {
  Query,
  Resolver,
  Args,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { CommentService } from 'src/comment/comment.service';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(
    private userService: UserService,
    private commentService: CommentService,
  ) {}

  @Query()
  users(@Args('page') page: number) {
    return this.userService.showAll(page);
  }

  @ResolveProperty()
  comments(@Parent() user) {
    const { id } = user;
    return this.commentService.showByUser(id);
  }
}
