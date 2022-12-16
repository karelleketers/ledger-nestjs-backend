import { Module } from '@nestjs/common';
import { CategoryIconsService } from './category-icons.service';
import { CategoryIconsResolver } from './category-icons.resolver';
import { CategoryIcon } from './entities/category-icon.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryIcon]), CaslModule],
  providers: [CategoryIconsResolver, CategoryIconsService],
})
export class CategoryIconsModule {}
