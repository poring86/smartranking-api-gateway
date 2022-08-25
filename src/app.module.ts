import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CategoriasModule } from './categorias/categorias.module';

@Module({
  imports: [CategoriasModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
