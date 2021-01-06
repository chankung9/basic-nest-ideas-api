import { UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
  Mutation,
  Context,
} from '@nestjs/graphql';
import { CommentService } from 'src/comment/comment.service';
import { AuthGuard } from 'src/shared/auth.guard';
import { IdeaDTO } from './idea.dto';
import { IdeaService } from './idea.service';

@Resolver('Idea')
export class IdeaResolver {
  constructor(
    private ideaService: IdeaService,
    private commentService: CommentService,
  ) {}

  @Query()
  ideas(@Args('page') page: number, @Args('newest') newest: boolean) {
    return this.ideaService.showAll(page, newest);
  }

  @Query()
  idea(@Args('id') id: string) {
    return this.ideaService.read(id);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  createIdea(
    @Args('idea') idea: string,
    @Args('description') description: string,
    @Context('user') user: any,
  ) {
    const { id } = user;
    const data: IdeaDTO = { idea, description };
    return this.ideaService.create(id, data);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  updateIdea(
    @Args('id') id: string,
    @Args('idea') idea: string,
    @Args('description') description: string,
    @Context('user') user: any,
  ) {
    const { id: userId } = user;
    const data: IdeaDTO = { idea, description };
    return this.ideaService.update(id, userId, data);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  deleteIdea(@Args('id') id: string, @Context('user') user: any) {
    const { id: userId } = user;
    return this.ideaService.destroy(id, userId);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  upvote(@Args('id') id: string, @Context('user') user: any) {
    const { id: userId } = user;
    return this.ideaService.upvote(id, userId);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  downvote(@Args('id') id: string, @Context('user') user: any) {
    const { id: userId } = user;
    return this.ideaService.downvote(id, userId);
  }
  @Mutation()
  @UseGuards(new AuthGuard())
  bookmark(@Args('id') id: string, @Context('user') user: any) {
    const { id: userId } = user;
    return this.ideaService.bookmark(id, userId);
  }
  @Mutation()
  @UseGuards(new AuthGuard())
  unbookmark(@Args('id') id: string, @Context('user') user: any) {
    const { id: userId } = user;
    return this.ideaService.unbookmark(id, userId);
  }

  @ResolveProperty()
  comments(@Parent() idea) {
    const { id } = idea;
    return this.commentService.showByIdea(id);
  }
}
