import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SoapService } from './soap.service';

@Module({
    imports: [HttpModule],
    providers: [SoapService],
    exports: [SoapService],
})
export class SoapModule {}