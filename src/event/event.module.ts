import { Global, Module } from '@nestjs/common';
import { StartupEventService } from '@/event/event.service';

@Global()
@Module({
  providers: [StartupEventService],
})
export class EventModule {}
