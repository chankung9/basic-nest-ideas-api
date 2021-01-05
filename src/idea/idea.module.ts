import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentEntity } from 'src/comment/comment.entity';
import { CommentService } from 'src/comment/comment.service';
import { UserEntity } from 'src/user/user.entity';
import { IdeaController } from './idea.controller';
import { IdeaEntity } from './idea.entity';
import { IdeaResolver } from './idea.resolver';
import { IdeaService } from './idea.service';

@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity, UserEntity, CommentEntity])],
  controllers: [IdeaController],
  providers: [IdeaService, IdeaResolver, CommentService],
})
export class IdeaModule {}
